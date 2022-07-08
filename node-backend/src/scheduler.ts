import { KboMatch } from './domain/kbo/kboMatch'
import { localDate } from '@/utils/date'
import { scheduleJob, Job } from 'node-schedule'
import { getLogger } from '@/utils/loggers'
import { patchKboMatches, putKboTeamRank } from '@/domain/kbo/kbo.service'
import app from './app'

const logger = getLogger('SCHEDULER')
export enum JobType {
  KboMatch = 'kboMatch',
  KboRank = 'kboRank',
  LckMatch = 'lckMatch',
}

export async function setDefaultScheduler() {
  const cron = '0 0 6 * * ? *'
  scheduleJob(cron, async () => {
    await setupSchedulers()
  })
}

export async function setupSchedulers() {
  // cancel job
  await tearDownSchedulers()
  // schedule job
  await setKboSchedulers()
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

    const kboRankJob = app.locals[JobType.KboMatch]
    if (kboRankJob instanceof Job) {
      kboRankJob.cancel()
      app.locals[JobType.KboMatch] = undefined
      logger.info('KBO 순위 정보 스케줄러 취소')
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
      app.locals[JobType.KboMatch] = await setKboMatchUpdateScheduler(
        dayMatches[0].startTime.toString()
      )
      app.locals[JobType.KboRank] = await setKboRankUpdateScheduler()
      logger.info('KBO 스케줄링 완료')
    } else {
      logger.info('스케줄링할 KBO 매치가 존재하지 않음')
    }
  } catch (err) {
    logger.error('KBO 스케줄링 중 에러 발생', err)
  }
}

async function setKboMatchUpdateScheduler(startTime: string) {
  const time = startTime.split(':')
  const today = localDate()
  const cron = `0 ${parseInt(time[1])}/5 ${parseInt(time[0])} ${today.getDate()} ${
    today.getMonth() + 1
  }`

  return scheduleJob(cron, async () => {
    try {
      await patchKboMatches()
      logger.info('KBO 매치 정보 업데이트 성공')
    } catch (err) {
      logger.error('KBO 매치 정보 업데이트 성공', err)
    }
  })
}

async function setKboRankUpdateScheduler() {
  const today = localDate()
  const cron = `0 0/15 21-22 ${today.getDate()} ${today.getMonth() + 1}`

  return scheduleJob(cron, async () => {
    try {
      await putKboTeamRank()
      logger.info('KBO 순위 정보 업데이트 성공')
    } catch (err) {
      logger.error('KBO 순위 정보 업데이트 실패', err)
    }
  })
}
