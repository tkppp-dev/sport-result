import { MysqlDateSource } from '@/datasource'
import { localDate, localTime } from '@/utils/date'
import moment from 'moment'
import { crawlingKboMatchDetail, crawlingKboSchedule, crawlingKboTeamRanking } from './kbo.crawling'
import { KboDayMatchGetResDto, KboDayMatchPatchReqDto, KboRankGetResDto } from './kbo.dto'
import { Team, MatchProgress } from './kbo.utils'
import { KboMatch } from './kboMatch'
import { KboRank } from './kboRank'
import app from '@/app'
import { JobType } from '@/scheduler'
import { getLogger } from '@/utils/loggers'

const logger = getLogger('KBO-SERVICE')

export async function putKboMonthSchedule(year: number, month: number) {
  const schedules = await crawlingKboSchedule(year, month)

  let transactionError: undefined | Error
  const qr = MysqlDateSource.createQueryRunner()
  await qr.connect()
  await qr.startTransaction()
  try {
    await qr.manager
      .getRepository(KboMatch)
      .createQueryBuilder()
      .delete()
      .where('matchDate >= :start', {
        start: moment(localDate({ year, month, day: 1 })).format('YYYY-MM-DD'),
      })
      .andWhere('matchDate <= :end', {
        end: moment(localDate({ year, month: month + 1, day: 0 })).format('YYYY-MM-DD'),
      })
      .execute()

    for (let daySchedules of schedules) {
      const matchDate = localDate({ year, month, day: daySchedules.matchDate[2] })
      for (let match of daySchedules.matchInfo) {
        const entity = new KboMatch()
        entity.matchDate = matchDate
        entity.startTime = localTime({
          hour: parseInt(match.startTime[0]),
          minute: parseInt(match.startTime[1]),
        })
        entity.home = match.home as Team
        entity.away = match.away as Team
        entity.homeScore = match.homeScore
        entity.awayScore = match.awayScore
        entity.matchProgress = match.matchProgress as MatchProgress
        await qr.manager.getRepository(KboMatch).save(entity)
      }
    }

    // commit transaction
    await qr.commitTransaction()
  } catch (err) {
    // rollback transaction
    await qr.rollbackTransaction()
    transactionError = err as Error
  } finally {
    // free connection
    await qr.release()
    if (transactionError !== undefined) throw transactionError
  }
}

export async function getKboDayMatches() {
  const matches: KboMatch[] = await KboMatch.createQueryBuilder()
    .where('matchDate = :now', { now: moment(localDate()).format('YYYY-MM-DD') })
    .getMany()
  return matches.map((entity) => new KboDayMatchGetResDto(entity))
}

export async function patchKboMatches() {
  const currentMatchDetails = await crawlingKboMatchDetail()
  const matches: KboMatch[] = await KboMatch.findBy({ matchDate: localDate() })
  let flag = 0

  for (let match of matches) {
    if (match.matchProgress === '경기취소' || match.matchProgress === '종료') {
      continue
    } else {
      flag = 1
      for (let matchDetail of currentMatchDetails) {
        if (matchDetail.home === match.home && matchDetail.away === match.away) {
          match.homeScore = matchDetail.homeScore
          match.awayScore = matchDetail.awayScore
          match.matchProgress = matchDetail.matchProgress as MatchProgress

          await KboMatch.save(match)
          break
        }
      }
    }
  }

  if (flag === 0) {
    try {
      app.locals[JobType.KboMatch].cancel()
      logger.info('KBO 매치 업데이트 스케줄러 취소 완료')
    } catch (err) {
      logger.error('KBO 매치 업데이트 스케줄러 취소 실패', err)
    }
  }
}

export async function putKboTeamRank() {
  const ranking = await crawlingKboTeamRanking()
  const qr = MysqlDateSource.createQueryRunner()
  qr.connect()

  const repository = qr.manager.getRepository(KboRank)
  const rankEntities = await repository.find({
    order: {
      ranking: 'ASC',
    },
  })
  let transactionError: Error | undefined
  qr.startTransaction()
  try {
    if (rankEntities.length === 0) {
      for (let i = 0; i < 10; i++) {
        const entity = new KboRank()
        entity.ranking = i + 1
        entity.name = ranking[i].name as Team
        entity.played = ranking[i].played
        entity.win = ranking[i].win
        entity.draw = ranking[i].draw
        entity.defeat = ranking[i].defeat
        entity.winRate = ranking[i].winRate
        entity.gameDiff = ranking[i].gameDiff

        await repository.save(entity)
      }
    } else {
      for (let i = 0; i < 10; i++) {
        const entity = rankEntities[i]
        entity.name = ranking[i].name as Team
        entity.played = ranking[i].played
        entity.win = ranking[i].win
        entity.draw = ranking[i].draw
        entity.defeat = ranking[i].defeat
        entity.winRate = ranking[i].winRate
        entity.gameDiff = ranking[i].gameDiff

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

export async function getKboTeamRank() {
  const ranks = await KboRank.find({
    order: {
      ranking: 'ASC',
    },
  })

  return ranks.map((entity) => new KboRankGetResDto(entity))
}
