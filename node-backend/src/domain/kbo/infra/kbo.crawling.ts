import { DateUtils } from '@/utils/dateUtils'
import axios from 'axios'
import * as cheerio from 'cheerio'

export interface KboMatchDetail {
  home: string,
  away: string,
  homeScore: number,
  awayScore: number,
  matchProgress: string
}

export interface KboScheduleDetail extends KboMatchDetail {
  startTime: string[]
}

export interface KboSchedule {
  matchDate: number[]
  matchInfo: KboScheduleDetail[]
}

export async function crawlingKboMatchDetail(): Promise<KboMatchDetail[]> {
  const url = 'https://sports.news.naver.com/kbaseball/index'
  const html = await axios.get(url)
  const $ = cheerio.load(html.data)

  const matches = $('#_tab_box_kbo .hmb_list ul')
    .children()
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
        awayScore: awayScore === '' ? 0 : parseInt(awayScore),
        matchProgress: matchProgress.split(':').length > 1 ? '경기전' : matchProgress,
      }
    })
    .toArray()

  return matches
}

export async function crawlingKboRanking() {
  const url = 'https://sports.news.naver.com/kbaseball/record/index?category=kbo'
  const html = await axios.get(url)
  const $ = cheerio.load(html.data)

  const rankHtml = $('#regularTeamRecordList_table')
  const rankData = $(rankHtml).children()
    .map((idx, node) => {
      const name = $(node).find('td:nth-child(2) span').text().trim()
      const played = $(node).find('td:nth-child(3) span').text()
      const win = $(node).find('td:nth-child(4) span').text()
      const defeat = $(node).find('td:nth-child(5) span').text()
      const draw = $(node).find('td:nth-child(6) span').text()
      const winRate = $(node).find('td:nth-child(7)').text()
      const gameDiff = $(node).find('td:nth-child(8) span').text()

      return {
        rank: idx + 1,
        name,
        played: parseInt(played),
        win: parseInt(win),
        draw: parseInt(draw),
        defeat: parseInt(defeat),
        winRate: parseFloat(winRate),
        gameDiff: parseFloat(gameDiff),
      }
    }).toArray()

    return rankData
}

export async function crawlingKboSchedule(year: number, month: number): Promise<KboSchedule[]> {
  const url = `https://sports.news.naver.com/kbaseball/schedule/index?month=${DateUtils.addZero(month)}&year=${year}`
  const html = await axios.get(url)
  const $ = cheerio.load(html.data)

  const matchSchedule = $('#calendarWrap')
    .children()
    .map((i, node) => {
      const matchDate = [year, month, i + 1]
      const matchInfo = $(node)
        .find('div table tbody')
        .children()
        .map((idx, tr) => {
          let startTime = $(tr).find('.td_hour').text()
          if (startTime === '-') return

          const home = $(tr).find('.team_lft').text()
          const away = $(tr).find('.team_rgt').text()
          let score: any = $(tr).find('.td_score').text()
          let matchProgress,
            homeScore = 0,
            awayScore = 0
          if ($(tr).find('.suspended').text() == '경기취소') {
            matchProgress = '경기취소'
          } else {
            if (score == 'VS') {
              matchProgress = '경기전'
            } else {
              const temp = score.split(':')
              matchProgress = '종료'
              homeScore = parseInt(temp[0])
              awayScore = parseInt(temp[1])
            }
          }

          return {
            startTime: startTime.split(':'),
            home,
            away,
            matchProgress,
            homeScore,
            awayScore,
          }
        })
        .toArray()

      return {
        matchDate,
        matchInfo,
      }
    })
    .toArray()

  return matchSchedule
}
