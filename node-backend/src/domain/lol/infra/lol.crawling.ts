import puppeteer from 'puppeteer'
import * as cheerio from 'cheerio'
import moment from 'moment'
import { DateUtils } from '@/utils/dateUtils';

const season = process.env.LOL_SEASON as string

export async function crawlingLolMatchDetail() {
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

export interface lolMatchDetail {
  matchDatetime: Date,
  state: string,
  home: string,
  away: string,
  homeScore: number,
  awayScore: number
}

export interface lolDaySchedule {
  date: Date,
  matches: lolMatchDetail[]
}

export async function crawlingLoLMonthSchedule(year: number, month: number): Promise<lolDaySchedule[]> {
  let broser
  try {
    const date = moment(new Date(year, month-1)).format('YYYY-MM')
    console.log(date)
    const url = `https://game.naver.com/esports/schedule/world_championship?date=${date}`
    broser = await puppeteer.launch({
      executablePath: process.env.CHROMIUM_PATH,
      args: ['--no-sandbox'],
    })
    const page = await broser.newPage()
    page.setDefaultNavigationTimeout(0)
    await Promise.all([page.goto(url), setTimeout(() => {}, 2000)])

    const $ = cheerio.load(await page.content())
    const dto = $("[class*='list_wrap__']")
      .children()
      .map((idx, node) => {
        if (node.attribs.class.startsWith('card_item__')) {
          const date: any = $(node).find("[class*='card_date__']").text().split(' ')
          if (parseInt(date[0].slice(0,2)) != month) {
            throw new Error('Month not correct error')
          }
          const matches = $(node)
            .find('ul')
            .children()
            .map((idx, matchNode) => {
              const startTime: any = $(matchNode).find("[class*='row_time__']").text().split(':')
              const state = $(matchNode).find("[class*='row_state__']").text()
              const team: any = $(matchNode).find("[class*='row_name__']")
              const score: any = $(matchNode).find("[class*='row_score__']")
              
              const matchDatetime = DateUtils.getDatetime({
                year, month, day: parseInt(date[1].slice(0, 2)),
                hour: parseInt(startTime[0]), min: parseInt(startTime[1])
              })

              return {
                matchDatetime: matchDatetime,
                state,
                home: team.get(0).firstChild.data,
                away: team.get(1).firstChild.data,
                homeScore: score.get(0) !== undefined ? score.get(0).firstChild.data : 0,
                awayScore: score.get(1) !== undefined ? score.get(1).firstChild.data : 0,
              }
            })
            .toArray()
          return {
            date: new Date(year, month - 1, parseInt(date[1].slice(0, 2))),
            matches,
          }
        } else {
          return
        }
      })
      .toArray()

    dto.sort((a, b) => {
      if (a.date < b.date) return -1
      else return 1
    })

    await broser.close()
    return dto
  } catch (err) {
    await broser?.close()
    throw err
  }
}
