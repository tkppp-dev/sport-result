import { DateUtils } from '@/utils/dateUtils'
import { Repository } from 'typeorm'
import { LolMatch } from '../model/lol.match'
import { lolDaySchedule } from '../../infra/lol.crawling'
import { MatchProgress } from '../model/lol.vo'

export async function deleteMonthlyLolSchedule(
  repo: Repository<LolMatch>,
  year: number,
  month: number
) {
  await repo
    .createQueryBuilder()
    .delete()
    .where('matchDatetime >= :start and matchDatetime < :end', {
      start: DateUtils.getDatetime({ year, month, day: 1 }),
      end: DateUtils.getDatetime({ year, month: month + 1, day: 1 }),
    })
    .execute()
}

export async function saveMonthlyLolSchedule(
  repo: Repository<LolMatch>,
  daySchedules: lolDaySchedule[],
  month: number
) {
  for (let daySchedule of daySchedules) {
    if (daySchedule.date.getMonth() + 1 !== month) throw new Error('잘못된 일정 데이터 수집')
    for (let schedule of daySchedule.matches) {
      const entity = LolMatch.create({
        matchDatetime: schedule.matchDatetime,
        matchProgress: schedule.state as MatchProgress,
        home: schedule.home,
        away: schedule.away,
        homeScore: schedule.homeScore,
        awayScore: schedule.awayScore,
      })
      await repo.save(entity)
    }
  }
}

export async function findLolWeekMatches(repo: Repository<LolMatch>) {
  const start = DateUtils.getDatetime()
  const end = DateUtils.getDatetime()
  let dayOffset = new Date().getDay()
  dayOffset = dayOffset === 0 ? 6 : dayOffset - 1

  start.setDate(start.getDate() - dayOffset)
  end.setDate(end.getDate() + 6 - dayOffset + 1)

  return repo
    .createQueryBuilder()
    .where('matchDatetime >= :start and matchDatetime < :end', {
      start,
      end,
    })
    .getMany()
}
