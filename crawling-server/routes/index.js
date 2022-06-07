import express from 'express'
import { getDayMatchResult, getKboTeamRanking, getYearlyKboSchedule } from '../service/kbo_crawling_service.js'

const router = express.Router();

router.get('/api/kbo/day', async function(req, res, next) {
  const dayMatchData = await getDayMatchResult(next)
  res.send(dayMatchData)
})

router.get('/api/kbo/rank', async function(req, res, next) {
  const rankData = await getKboTeamRanking(next)
  res.send(rankData)
})

router.get('/api/kbo/:year', async function(req, res, next) {
  const result = await getYearlyKboSchedule(req.params.year, next)
  res.send(result)
});


export default router
