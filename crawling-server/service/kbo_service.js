import axios from 'axios';
import cheerio from 'cheerio';

export async function getDayMatchResult(next) {
  try {
    const url = 'https://sports.news.naver.com/kbaseball/index'
    const html = await axios.get(url)
    const $ = cheerio.load(html.data)

    const matchSummarys = $('#_tab_box_kbo .hmb_list ul').children()
      .map((idx, node) => {
        const home = $(node).find('.vs_list1 .inner .name').text()
        const homeScore = $(node).find('.vs_list1 .inner .score').text().trim()
        const away = $(node).find('.vs_list2 .inner .name').text()
        const awayScore = $(node).find('.vs_list2 .inner .score').text().trim()
        const matchProgress = $(node).find('.state .inner em').text()

        return {
          home,
          away,
          homeScore: homeScore === '' ? 0 : parseInt(homeScore),
          awayScore: awayScore === '' ? 0 :parseInt(awayScore),
          matchProgress: matchProgress.split(':').length > 1 ? '경기전' : matchProgress
        }
      }).toArray()
    
    if(matchSummarys.length > 0) await axios.put("http://localhost:8080/api/kbo/day", matchSummarys)
    return matchSummarys.map ((match) => match.matchProgress)
  } catch(err){
    console.error(err)
    next(err)
  }
}

export async function getKboTeamRanking(next) {
  try {
    const url = 'https://sports.news.naver.com/kbaseball/index'
    const html = await axios.get(url)
    const $ = cheerio.load(html.data)

    const teamRankHtml = $('#rank_template1').children()
    const teamRank = $(teamRankHtml).find('.kbo tbody').children()
      .map((idx, node) => {
        const name = $(node).find('.name').text()
        const played = $(node).find('td:nth-child(3) span').text()
        const win = $(node).find('td:nth-child(4) span').text()
        const draw = $(node).find('td:nth-child(5) span').text()
        const defeat = $(node).find('td:nth-child(6) span').text()
        const winRate = $(node).find('td:nth-child(7) span').text()
        const gameDiff = $(node).find('td:nth-child(8) span').text()

        return {
          rank: idx+1,
          name,
          played: parseInt(played),
          win: parseInt(win),
          draw: parseInt(draw),
          defeat: parseInt(defeat),
          winRate: parseFloat(winRate),
          gameDiff: parseFloat(gameDiff)
        }
      }).toArray()
    
    await axios.put("http://localhost:8080/api/kbo/rank", teamRank)
  } catch(err){
    console.error(err)
    next(err)
  }
}

export async function getYearlyKboSchedule(year, next) {
  try{
    const url = `https://sports.news.naver.com/kbaseball/schedule/index?month=06&year=${year}`;
    const html = await axios.get(url);
    const $ = cheerio.load(html.data);

    const monthList = $('#_monthList')
      .children()
      .map((idx, node) => {
        return $(node).find('li button').text();
      }).toArray();
    
    const yearlySchedule = []
    for(let month of monthList){
      const monthSchedule = await crawlingKboSchedule(year, month)
      yearlySchedule.push(monthSchedule)
    }

    return yearlySchedule
  } catch(err){
    console.error(err)
    next(err)
  }
}

async function crawlingKboSchedule(year, month) {
  try {
    // 현재 네이버 기준 일정 조회는 2008년 까지 가능
    const url = `https://sports.news.naver.com/kbaseball/schedule/index?month=${month}&year=${year}`;
    const html = await axios.get(url);
    const $ = cheerio.load(html.data);

    const matchSchedule = $('#calendarWrap')
      .children()
      .map((i, node) => {
        const matchDate = [parseInt(year), parseInt(month), i + 1];
        const matchInfo = $(node)
          .find('div table tbody')
          .children()
          .map((idx, tr) => {
            let startTime = $(tr).find('.td_hour').text()
            const home = $(tr).find('.team_lft').text();
            const away = $(tr).find('.team_rgt').text();
            let score = $(tr).find('.td_score').text();
            let matchStatus, matchProgress

            startTime = startTime == '-' ? null : startTime.split(':')
            if($(tr).find('.suspended').text() == '경기취소'){
              matchStatus = 'CANCELED'
              matchProgress = '경기취소'
            } else if (startTime == null){
              matchStatus = 'NO_MATCH'
              matchProgress = null
            } else {
              matchStatus = (score == 'VS' ? 'BEFORE_MATCH' : 'AFTER_MATCH');
              matchProgress = (score == 'VS' ? '경기전' : '종료');
            }
            score = score == 'VS' ? [0, 0] : score.split(':');

            return {
              startTime: startTime,
              home,
              away,
              matchStatus,
              matchProgress,
              homeScore: score[0],
              awayScore: score[1],
            };
          }).toArray();

        return {
          matchDate,
          matchInfo,
        };
      }).toArray();

    return matchSchedule;
  } catch (err) {
    throw err
  }
}
