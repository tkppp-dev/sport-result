import axios from 'axios';
import cheerio from 'cheerio';

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
            let matchStatus

            startTime = startTime == '-' ? null : startTime.split(':')
            if($(tr).find('.suspended').text() == '경기취소'){
              matchStatus = 'CANCELED'
            } else if (startTime == null){
              matchStatus = 'NO_MATCH'
            } else {
              matchStatus = (score == 'VS' ? 'BEFORE_MATCH' : 'AFTER_MATCH');
            }
            score = score == 'VS' ? [0, 0] : score.split(':');

            return {
              startTime: startTime,
              home,
              away,
              matchStatus,
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
