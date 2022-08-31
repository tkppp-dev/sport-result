import express from 'express';
import { getKboDayMatches, putKboMonthSchedule } from '../service/kbo.match.service';
import { MessageDto } from '@/utils/default.dto';
import { getKboTeamRank } from '../service/kbo.rank.service';

const router = express.Router();

router.get('/day', async (req, res, next) => {
  const matchDtos = await getKboDayMatches()
  res.json(matchDtos)
})

router.put('/schedule', async (req, res, next) => {
  const year = parseInt(req.query.year as string)
  const month = parseInt(req.query.month as string)
  await putKboMonthSchedule(year, month)
  res.json(new MessageDto(`KBO ${year}-${month} 스케줄 업데이트 성공`))
})

router.get('/rank', async (req, res, next) => {
  const rankDto = await getKboTeamRank()
  res.json(rankDto)
})

export default router;