import { crawlingLckMatchResult, crawlingLckMonthSchedule } from './lck.crawling'
import { MysqlDateSource } from '../../config/config.db'
import { LckMatch } from './lckMatch'
import moment from 'moment'
import { localDate, localTime } from '@/utils/date'
import { LoLTeam, LoLTeamName } from './lck.utils'
import app from '@/app'
import { JobType } from '@/config/config.scheduler'
import { getLogger } from '@/utils/loggers'
import { LckDayMatchDto, LckWeekMatchDto } from './lck.dto'

const logger = getLogger('LCK SERVICE')

export async function putLckMonthSchedule(year: number, month: number) {
  const daySchedules = await crawlingLckMonthSchedule(year, month)

  const qr = MysqlDateSource.createQueryRunner()
  await qr.connect()

  let transactionError: Error | undefined
  await qr.startTransaction()
  try {
    const repository = qr.manager.getRepository(LckMatch)
    await repository
      .createQueryBuilder()
      .delete()
      .where('matchDate >= :start', {
        start: moment(localDate({ year, month, day: 1 })).format('YYYY-MM-DD'),
      })
      .andWhere('matchDate <= :end', {
        end: moment(localDate({ year, month: month + 1, day: 0 })).format('YYYY-MM-DD'),
      })
      .execute()

    for (let daySchedule of daySchedules) {
      if (daySchedule.date.getMonth() + 1 !== month) throw new Error('잘못된 일정 데이터 수집')
      for (let schedule of daySchedule.matches) {
        const entity = new LckMatch()
        entity.matchDate = daySchedule.date
        entity.startTime = localTime({
          hour: parseInt(schedule.startTime[0]),
          minute: parseInt(schedule.startTime[1]),
        })
        entity.matchProgress = schedule.state
        entity.home = schedule.home
        entity.away = schedule.away
        entity.homeScore = schedule.homeScore
        entity.awayScore = schedule.awayScore
        await repository.save(entity)
      }
    }

    await qr.commitTransaction()
  } catch (err) {
    await qr.rollbackTransaction()
    transactionError = err as Error
  } finally {
    await qr.release()
    if (transactionError !== undefined) throw transactionError
  }
}

export async function patchLckTodayMatches() {
  const currentMacthInfos = await crawlingLckMatchResult()
  const matches = await LckMatch.findTodayMatches()
  let flag = 0

  for (let match of matches) {
    if (
      match.matchProgress === '종료' ||
      match.matchProgress === '경기취소' ||
      match.matchProgress === '취소'
    ) {
      continue
    }

    for (let matchInfo of currentMacthInfos) {
      if (
        match.home === LoLTeam[matchInfo.home as LoLTeamName] &&
        match.away === LoLTeam[matchInfo.away as LoLTeamName]
      ) {
        flag = 1
        match.homeScore = matchInfo.homeScore
        match.awayScore = matchInfo.awayScore
        match.matchProgress = matchInfo.state
        await match.save()
        break
      }
    }
  }

  if(!currentMacthInfos.length) {
    throw new Error('크롤링 데이터 수집에 문제 발생')
  } else if (!flag) {
    app.locals[JobType.LckMatch].cancel()
    logger.info('LCK 매치 업데이트 스케줄러 중단')
  }
}

export async function getLckWeekMatches() {
  const weekMatches = await LckMatch.findThisWeekMatches()
  const dto = new LckWeekMatchDto()
  const group: { [date: string]: LckMatch[] } = {}

  weekMatches.map((match) => {
    const date = match.matchDate.toString()
    if (!(date in group)) {
      group[date] = []
    }
    group[date].push(match)
  })

  for (let key in group) {
    const date = new Date(key).getDate()
    if (date === localDate().getDate()) {
      dto.todayMatches = new LckDayMatchDto(key, group[key])
    }
    dto.weekMatches.push(new LckDayMatchDto(key, group[key]))
  }
  return dto
}
