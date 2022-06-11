import express from 'express'
import { getDayMatchResult, getKboTeamRanking, getYearlyKboSchedule } from '../service/kbo_crawling_service.js'
import localDate from '../util/localeDate.js';

const router = express.Router();

router.get('/api/kbo/day', async function(req, res, next) {
  async function sendDayResultData() {
    const progresses = await getDayMatchResult(next)
    console.log(`[${localDate().toISOString()}] - KBO day match result data send`)
    for(let progress of progresses) {
      if(progress != '종료' && progress != '경기취소'){
        return true
      }
    }

    return false
  }

  const temp = await sendDayResultData()
  if(temp) {
    const interval = setInterval(async () => {
      const repeat = await sendDayResultData()
      if(!repeat) {
        console.log(`${localDate().toISOString()} - KBO day match result data sending ended`)
        clearInterval(interval)
      }
    }, 1000 * 60 * 5)
  } else {
    console.log(`${localDate().toISOString()} - KBO day match result data sending ended`)
  }

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


export default router
