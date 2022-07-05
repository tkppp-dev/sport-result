import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import axios from 'axios';

const season = '2022 LCK 서머';
const broser = await puppeteer.launch();

export async function getLckMatchResult(next) {
  try {
    const url = 'https://game.naver.com/esports';
    const page = await broser.newPage();
    page.setDefaultNavigationTimeout(0)
    await page.goto(url);
    const $ = cheerio.load(await page.content());
    const states = []
    const matchInfos = $("[class*='broadcast_content__']")
      .children()
      .map((idx, node) => {
        const type = $(node).find("[class*='broadcast_match_name__']").text();
        if (type.startsWith(season)) {
          const team = $(node).find("[class*='broadcast_name__']");
          const score = $(node).find("[class*='broadcast_num__']");
          const state = $(node).find("[class*='broadcast_status__']")
          states.push(state)

          return {
            state: state.get(0).firstChild.data,
            home: team.get(0).firstChild.data,
            away: team.get(1).firstChild.data,
            homeScore: score.get(0) != undefined ? parseInt(score.get(0).firstChild.data) : 0,
            awayScore: score.get(1) != undefined ? parseInt(score.get(1).firstChild.data) : 0,
          };
        } else {
          return;
        }
      }).toArray();
      if(matchInfos.length > 0) await axios.patch('http://localhost:8080/api/lck/day', matchInfos)
      return states
  } catch (err) {
    console.error('Error occured at getLckMatchResult()');
    next(err);
  }
}

export async function getLckMonthSchedule(year, month, next) {
  try {
    const url = `https://game.naver.com/esports/schedule/lck?date=${year}-${month}`;
    const page = await broser.newPage();
    page.setDefaultNavigationTimeout(0)
    await page.goto(url);

    const $ = cheerio.load(await page.content());
    return $("[class*='list_wrap__']").children()
      .map((idx, node) => {
        if (node.attribs.class.startsWith('card_item__') && node.attribs['data-time-stamp'] != '') {
          const date = $(node).find("[class*='card_date__']").text().split(' ')
          const matches = $(node).find('ul').children().map((idx, matchNode) => {
            const startTime = $(matchNode).find("[class*='row_time__']").text().split(':')
            const state = $(matchNode).find("[class*='row_state__']").text()
            const team = $(matchNode).find("[class*='row_name__']")
            const score = $(matchNode).find("[class*='row_score__']")

            return {
              startTime,
              state,
              home: team.get(0).firstChild.data,
              away: team.get(1).firstChild.data,
              homeScore: score.get(0) != undefined ? score.get(0).firstChild.data : 0,
              awayScore: score.get(1) != undefined ? score.get(1).firstChild.data : 0
            }
          }).toArray()

          return {
            date: [year, date[0].slice(0,2), date[1].slice(0,2)],
            matches
          }
        } else {
          return;
        }
      }).toArray();
  } catch (err) {
    console.error('Error occured at getMonthSchedule()');
    next(err);
  }
}
