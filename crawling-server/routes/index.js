import express from 'express'
import { getDayMatchResult, getKboTeamRanking, getYearlyKboSchedule } from '../service/kbo_service.js'
import { getLckMatchResult, getLckMonthSchedule } from '../service/lck_service.js';
import localDate from '../util/localeDate.js';

const router = express.Router();

async function sendDayResultData(name, callback, next) {
  const progresses = await callback(next)
  console.log(`[${localDate().toISOString()}] ${name} day match result data send`)
  for(let progress of progresses) {
    if(progress != '종료' && progress != '경기취소' && progress != '취소'){
      return true
    }
  }
  return false
}

async function stopInterval(isEnd, name, callback, next) {
  if(isEnd) {
    const interval = setInterval(async () => {
      const repeat = await sendDayResultData(name, callback, next)
      if(!repeat) {
        console.log(`${localDate().toISOString()} ${name} day match result data sending ended`)
        clearInterval(interval)
      }
    }, 1000 * 60 * 5)
  } else {
    console.log(`${localDate().toISOString()} ${name} day match result data sending ended`)
  }
}

router.get('/api/kbo/day', async function(req, res, next) {
  const serviceName = 'KBO'
  const isEnd = await sendDayResultData(serviceName, getDayMatchResult, next)
  stopInterval(isEnd, serviceName, getDayMatchResult, next)

  res.status(200)
  res.send()
})

router.get('/api/kbo/rank', async function(req, res, next) {
  await getKboTeamRanking(next)
  
  res.status(200)
  res.send()
})

router.get('/api/kbo/:year', async function(req, res, next) {
  const result = await getYearlyKboSchedule(req.params.year, next)
  res.send(result)
});

router.get('/api/lck/day', async (req, res, next) => {
  const serviceName = 'LCK'
  const isEnd = await sendDayResultData(serviceName, getLckMatchResult, next)
  stopInterval(isEnd, serviceName, getLckMatchResult, next)
  res.status(200)
  res.send()
})

router.get('/api/lck/schedule', async (req, res, next) => {
  const year = req.query.year
  const month = req.query.month < 10 ? `0${req.query.month}` : req.query.month
  const result = await getLckMonthSchedule(year, month, next)
  res.send(result)
})

export default router
