import express from 'express'
import { getYearlyKboSchedule } from '../service/kbo_crawling_service.js'

const router = express.Router();

router.get('/', async function(req, res, next) {
  const result = await getYearlyKboSchedule(2022)
  console.log(result)
  res.send(result)
});

export default router
