import express from 'express'
import { getYearlyKboSchedule } from '../service/kbo_crawling_service.js'

const router = express.Router();

router.get('/api/kbo/:year', async function(req, res, next) {
  console.log(req.params.year)
  const result = await getYearlyKboSchedule(req.params.year, next)
  res.send(result)
});

export default router
