import { KboMatch } from '../domain/kbo/domain/model/kboMatch'
import { scheduleJob, Job } from 'node-schedule'
import { getLogger } from '@/utils/loggers'
import { patchKboMatches } from '@/domain/kbo/service/kbo.match.service'
import { app } from '../app'
import { putKboTeamRank } from '@/domain/kbo/service/kbo.rank.service'
import { DateUtils } from '@/utils/dateUtils'
import { findLolTodayMatches } from '@/domain/lol/domain/service/lol.match.domin.service'
import { patchLolTodayMatches } from '@/domain/lol/service/lol.match.service';

const logger = getLogger('SCHEDULER')

export enum JobType {
  KboMatch = 'kboMatch',
  KboRank = 'kboRank',
  LolMatch = 'lolMatch',
}

export async function setupDefaultScheduler() {
  const cron = '0 0 2 * * *'
  scheduleJob(cron, async function () {
    logger.info('정기 스케줄링 실행')
    await tearDownSchedulers()
    await setupSchedulers()
  })
}

async function tearDownSchedulers() {
  try {
    logger.info('스케줄링 데이터 삭제 시작')
    tearDownJob(JobType.KboMatch)
    tearDownJob(JobType.KboRank)
    tearDownJob(JobType.LolMatch)
    logger.info('스케줄링 데이터 삭제 종료')
  } catch (err) {
    logger.error('스케줄링 데이터 삭제 중 에러 발생', err)
  }
}

function tearDownJob(jobType: JobType) {
  const job = app.locals[jobType]
  if (job instanceof Job) {
    job.cancel()
    app.locals[jobType] = undefined
    logger.info(`${jobType} 스케줄러 취소`)
  }
}

export async function setupSchedulers() {
  // schedule job
  logger.info('스케줄러 셋업 시작')
  await setKboSchedulers()
  await setLckSchedulers()
  logger.info('스케줄러 셋업 종료')
}

async function setKboSchedulers() {
  try {
    const dayMatches = await KboMatch.findTodayMatches()
    if (dayMatches.length > 0) {
      app.locals[JobType.KboMatch] = setKboMatchUpdateScheduler(
        DateUtils.parseHourMinuteString(dayMatches[0].matchDatetime)
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

function setKboMatchUpdateScheduler(startTime: string) {
  const time = startTime.split(':')
  const today = new Date()
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
  const today = new Date()
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
    const dayMatches = await findLolTodayMatches()
    if (dayMatches.length > 0) {
      app.locals[JobType.LolMatch] = setLckMatchScheduler(
        dayMatches[0].matchDatetime.getHours(),
        dayMatches[0].matchDatetime.getMinutes()
      )
      logger.info('LOL 스케줄링 완료')
    } else {
      logger.info('스케줄링할 LOL 매치가 존재하지 않음')
    }
  } catch (err) {
    logger.error('LOL 스케줄링 중 에러 발생', err)
  }
}

function setLckMatchScheduler(hour: number, minute: number) {
  const today = new Date()
  const cron = `15 ${minute}/10 ${hour}-23 ${today.getDate()} ${
    today.getMonth() + 1
  } ?`

  return scheduleJob(cron, async () => {
    try {
      await patchLolTodayMatches()
      logger.info('LOL 매치 정보 업데이트 성공')
    } catch (err) {
      logger.error('LOL 매치 정보 업데이트 실패 -', (err as Error).message)
    }
  })
}
