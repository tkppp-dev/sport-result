import { MysqlDateSource } from '@/config/config.db'
import { crawlingKboMatchDetail, crawlingKboSchedule, crawlingKboTeamRanking } from '../infra/kbo.crawling'
import { KboDayMatchGetResDto, KboRankGetResDto } from '../utils/kbo.dto'
import { Team, MatchProgress } from '../domain/model/vo/kbo.vo'
import { KboMatch } from '../domain/model/kboMatch'
import { KboRank } from '../domain/model/kboRank'
import app from '@/app' 
import { JobType } from '@/config/config.scheduler'
import { getLogger } from '@/utils/loggers'
import { deleteMonthlyKboSchedule, saveMonthlyKboSchedule, updateKboMatch } from '../domain/service/kboMatch.service'

const logger = getLogger('KBO SERVICE')

export async function putKboMonthSchedule(year: number, month: number) {
  const schedules = await crawlingKboSchedule(year, month)

  let transactionError: undefined | Error
  const qr = MysqlDateSource.createQueryRunner()
  await qr.connect()
  await qr.startTransaction()
  try {
    const matchRepo = qr.manager.getRepository(KboMatch)
    await deleteMonthlyKboSchedule(matchRepo, year, month)
    await saveMonthlyKboSchedule(matchRepo, schedules, year, month)
    await qr.commitTransaction()
  } catch (err) {
    await qr.rollbackTransaction()
    transactionError = err as Error
  } finally {
    await qr.release()
    if (transactionError !== undefined) throw transactionError
  }
}

export async function getKboDayMatches() {
  const matches: KboMatch[] = await KboMatch.findTodayMatches()
  return matches.map((entity) => new KboDayMatchGetResDto(entity))
}

export async function patchKboMatches() {
  const currentMatchDetails = await crawlingKboMatchDetail()
  const matches: KboMatch[] = await KboMatch.findTodayMatches()
  let flag = 0

  for (let match of matches) {
    flag += await updateKboMatch(match, currentMatchDetails)
  }

  if (flag === 0) {
    try {
      app.locals[JobType.KboMatch].cancel()
      logger.info('KBO 매치 업데이트 스케줄러 중단')
    } catch (err) {
      logger.error('KBO 매치 업데이트 스케줄러 증단 실패', err)
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
