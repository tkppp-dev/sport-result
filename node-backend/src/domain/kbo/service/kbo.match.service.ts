import { app } from '@/app' 
import { MysqlDateSource } from '@/config/config.db'
import { crawlingKboMatchDetail, crawlingKboSchedule } from '../infra/kbo.crawling'
import { KboDayMatchGetResDto } from '../utils/kbo.dto'
import { KboMatch } from '../domain/model/kboMatch'
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
    await saveMonthlyKboSchedule(matchRepo, schedules)
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