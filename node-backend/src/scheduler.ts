import { KboMatch } from './domain/kbo/kboMatch'
import { localDate } from '@/utils/date'
import { scheduleJob, Job, } from 'node-schedule'
import { getLogger } from '@/utils/loggers'
import { patchKboMatches, putKboTeamRank } from '@/domain/kbo/kbo.service'
import app from './app'
import { patchLckTodayMatches } from './domain/lck/lck.service'
import { LckMatch } from './domain/lck/lckMatch'

const logger = getLogger('SCHEDULER')
export enum JobType {
  KboMatch = 'kboMatch',
  KboRank = 'kboRank',
  LckMatch = 'lckMatch',
}

export async function setDefaultScheduler() {
  const cron = '0 0 6 * * *'
  scheduleJob(cron, async function () {
    logger.info('정기 스케줄링 실행')
    await setupSchedulers()
  })
}

export async function setupSchedulers() {
  // cancel job
  await tearDownSchedulers()
  // schedule job
  logger.info('스케줄러 셋업 시작')
  await setKboSchedulers()
  await setLckSchedulers()
  logger.info('스케줄러 셋업 완료')
}

async function tearDownSchedulers() {
  try {
    logger.info('스케줄링 데이터 삭제 시작')
    const kboMatchJob = app.locals[JobType.KboMatch]
    if (kboMatchJob instanceof Job) {
      kboMatchJob.cancel()
      app.locals[JobType.KboMatch] = undefined
      logger.info('KBO 매치 정보 스케줄러 취소')
    }

    const kboRankJob = app.locals[JobType.KboRank]
    if (kboRankJob instanceof Job) {
      kboRankJob.cancel()
      app.locals[JobType.KboMatch] = undefined
      logger.info('KBO 순위 정보 스케줄러 취소')
    }

    const lckMatchJob = app.locals[JobType.LckMatch]
    if (lckMatchJob instanceof Job) {
      lckMatchJob.cancel()
      app.locals[JobType.LckMatch] = undefined
      logger.info('LCK 매치 정보 스케줄러 취소')
    }

    logger.info('스케줄링 데이터 삭제 완료')
  } catch (err) {
    logger.error('스케줄링 데이터 삭제 중 에러 발생', err)
  }
}

async function setKboSchedulers() {
  try {
    const dayMatches = await KboMatch.findTodayMatches()
    if (dayMatches.length > 0) {
      app.locals[JobType.KboMatch] = setKboMatchUpdateScheduler(dayMatches[0].startTime.toString())
      app.locals[JobType.KboRank] = await setKboRankUpdateScheduler()
      logger.info('KBO 스케줄링 완료')
    } else {
      logger.info('스케줄링할 KBO 매치가 존재하지 않음')
    }
  } catch (err) {
    logger.error('KBO 스케줄링 중 에러 발생', err)
  }
}

function setKboMatchUpdateScheduler(startTime: string) {
  const time = startTime.split(':')
  const today = localDate()
  const cron = `0 ${parseInt(time[1])}/3 ${parseInt(time[0])}-23 ${today.getDate()} ${
    today.getMonth() + 1
  } ?`

  return scheduleJob(cron, async () => {
    try {
      await patchKboMatches()
      logger.info('KBO 매치 정보 업데이트 성공')
    } catch (err) {
      logger.error('KBO 매치 정보 업데이트 실패', err)
    }
  })
}

async function setKboRankUpdateScheduler() {
  const today = localDate()
  const cron = `0 30/15 21-23 ${today.getDate()} ${today.getMonth() + 1} ?`

  return scheduleJob(cron, async () => {
    try {
      await putKboTeamRank()
      logger.info('KBO 순위 정보 업데이트 성공')
    } catch (err) {
      logger.error('KBO 순위 정보 업데이트 실패', err)
    }
  })
}

async function setLckSchedulers() {
  try {
    const dayMatches = await LckMatch.findTodayMatches()
    if (dayMatches.length > 0) {
      app.locals[JobType.LckMatch] = setLckMatchScheduler(dayMatches[0].startTime.toString())
      logger.info('LCK 스케줄링 완료')
    } else {
      logger.info('스케줄링할 LCK 매치가 존재하지 않음')
    }
  } catch (err) {
    logger.error('LCK 스케줄링 중 에러 발생', err)
  }
}

function setLckMatchScheduler(startTime: string) {
  const time = startTime.split(':')
  const today = localDate()
  const cron = `15 0/10 ${parseInt(time[0])}-23 ${today.getDate()} ${today.getMonth() + 1} ?`

  return scheduleJob(cron, async () => {
    try {
      await patchLckTodayMatches()
      logger.info('LCK 매치 정보 업데이트 성공')
    } catch (err) {
      logger.error('LCK 매치 정보 업데이트 실패')
    }
  })
}
