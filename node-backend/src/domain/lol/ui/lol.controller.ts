import express from 'express';
import { MessageDto } from '@/utils/default.dto';
import { getLolWeekMatches, putLolMontlySchedule } from '../service/lol.match.service';

const router = express.Router();

router.get('/week', async (req, res, next) => {
  const dto = await getLolWeekMatches()
  res.json(dto)
})

router.put('/schedule', async (req, res, next) => {
  const year = parseInt(req.query.year as string)
  const month = parseInt(req.query.month as string)
  await putLolMontlySchedule(year, month)
  res.json(new MessageDto(`LOL ${year}-${month} 스케줄 업데이트 성공`))
})

export default router;