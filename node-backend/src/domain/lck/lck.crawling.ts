import puppeteer from 'puppeteer'
import * as cheerio from 'cheerio'
import moment from 'moment'
import { DateUtils } from '../../utils/dateUtils'

const season = process.env.LCK_SEASON as string

export async function crawlingLckMatchResult() {
  let broser
  try {
    const url = 'https://game.naver.com/esports'
    broser = await puppeteer.launch({
      executablePath: process.env.CHROMIUM_PATH,
      args: ['--no-sandbox'],
    })
    const page = await broser.newPage()
    page.setDefaultNavigationTimeout(0)
    await page.goto(url)

    const $ = cheerio.load(await page.content())
    const dto = $("[class*='broadcast_content__']")
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

    await broser.close()
    return dto
  } catch (err) {
    await broser?.close()
    throw err
  }
}

export async function crawlingLckMonthSchedule(year: number, month: number) {
  let broser
  try {
    const date = moment(new Date(year, month)).format('YYYY-MM')
    const url = `https://game.naver.com/esports/schedule/lck?date=${date}`
    broser = await puppeteer.launch({
      executablePath: process.env.CHROMIUM_PATH,
      args: ['--no-sandbox'],
    })
    const page = await broser.newPage()
    page.setDefaultNavigationTimeout(0)
    await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), page.goto(url)])

    const $ = cheerio.load(await page.content())
    const dto = $("[class*='list_wrap__']")
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
            date: new Date(year, parseInt(date[0].slice(0, 2)), parseInt(date[1].slice(0, 2))),
            matches,
          }
        } else {
          return
        }
      })
      .toArray()

    await broser.close()
    return dto
  } catch (err) {
    await broser?.close()
    throw err
  }
}
