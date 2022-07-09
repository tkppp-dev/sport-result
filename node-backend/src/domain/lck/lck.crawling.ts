import puppeteer from 'puppeteer'
import * as cheerio from 'cheerio'
import moment from 'moment'
import { localDate } from '@/utils/date'

const season = '2022 LCK 서머'

export async function crawlingLckMatchResult() {
  const url = 'https://game.naver.com/esports'
  const broser = await puppeteer.launch()
  const page = await broser.newPage()
  page.setDefaultNavigationTimeout(0)
  await page.goto(url)

  const $ = cheerio.load(await page.content())
  return $("[class*='broadcast_content__']")
    .children()
    .map((idx, node) => {
      const type = $(node).find("[class*='broadcast_match_name__']").text()
      if (type.startsWith(season)) {
        const team: any = $(node).find("[class*='broadcast_name__']")
        const score: any = $(node).find("[class*='broadcast_num__']")
        const state: any = $(node).find("[class*='broadcast_status__']")

        return {
          state: state.get(0).firstChild.data,
          home: team.get(0).firstChild.data,
          away: team.get(1).firstChild.data,
          homeScore: score.get(0) != undefined ? parseInt(score.get(0).firstChild.data) : 0,
          awayScore: score.get(1) != undefined ? parseInt(score.get(1).firstChild.data) : 0,
        }
      } else {
        return
      }
    })
    .toArray()
}

export async function crawlingLckMonthSchedule(year: number, month: number) {
  const date = moment(localDate({ year, month })).format('YYYY-MM')
  const url = `https://game.naver.com/esports/schedule/lck?date=${date}`
  const broser = await puppeteer.launch()
  const page = await broser.newPage()
  page.setDefaultNavigationTimeout(0)
  await page.goto(url)

  const $ = cheerio.load(await page.content())
  return $("[class*='list_wrap__']")
    .children()
    .map((idx, node) => {
      if (node.attribs.class.startsWith('card_item__') && node.attribs['data-time-stamp'] != '') {
        const date = $(node).find("[class*='card_date__']").text().split(' ')
        const matches = $(node)
          .find('ul')
          .children()
          .map((idx, matchNode) => {
            const startTime = $(matchNode).find("[class*='row_time__']").text().split(':')
            const state = $(matchNode).find("[class*='row_state__']").text()
            const team: any = $(matchNode).find("[class*='row_name__']")
            const score: any = $(matchNode).find("[class*='row_score__']")

            return {
              startTime,
              state,
              home: team.get(0).firstChild.data,
              away: team.get(1).firstChild.data,
              homeScore: score.get(0) !== undefined ? score.get(0).firstChild.data : 0,
              awayScore: score.get(1) !== undefined ? score.get(1).firstChild.data : 0,
            }
          })
          .toArray()

        return {
          date: localDate({
            year,
            month: parseInt(date[0].slice(0, 2)),
            day: parseInt(date[1].slice(0, 2)),
          }),
          matches,
        }
      } else {
        return
      }
    })
    .toArray()
}
