import express from 'express';
import { MessageDto } from '@/utils/default.dto';
import { getLckWeekMatches, putLckMonthSchedule } from './lck.service';

const router = express.Router();

router.get('/week', async (req, res, next) => {
  const dto = await getLckWeekMatches()
  res.json(dto)
})

router.put('/schedule', async (req, res, next) => {
  const year = parseInt(req.query.year as string)
  const month = parseInt(req.query.month as string)
  await putLckMonthSchedule(year, month)
  res.json(new MessageDto(`LCK ${year}-${month} 스케줄 업데이트 성공`))
})

export default router;