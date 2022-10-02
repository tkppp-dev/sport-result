import { app } from '@/app';
import { MysqlDateSource } from '@/config/config.db';
import { crawlingLoLMonthSchedule, crawlingLolTodayMatches } from '@/domain/lol/infra/lol.crawling';
import { DateUtils } from '@/utils/dateUtils';
import { LolMatch } from '../domain/model/lol.match';
import { deleteMonthlyLolSchedule, findLolTodayMatches, findLolWeekMatches, saveMonthlyLolSchedule, updateTodayLolMatch } from '../domain/service/lol.match.domin.service';
import { getLolDayMatchesDto, getWeekMatchesDto } from '../utils/lol.dto';
import { JobType } from '../../../config/config.scheduler';
import { getLogger } from '@/utils/loggers'

const logger = getLogger('LOL SERVICE')

export async function putLolMontlySchedule(year: number, month: number) {
  const daySchedules = await crawlingLoLMonthSchedule(year, month)

  const qr = MysqlDateSource.createQueryRunner()
  await qr.connect()

  let transactionError: Error | undefined
  await qr.startTransaction()
  try {
    const repositroy = qr.manager.getRepository(LolMatch)
    await deleteMonthlyLolSchedule(repositroy, year, month)
    await saveMonthlyLolSchedule(repositroy, daySchedules, month)
    
    await qr.commitTransaction()
  } catch(err) {
    await qr.rollbackTransaction()
    transactionError = err as Error
  } finally {
    await qr.release()
    if (transactionError !== undefined) throw transactionError
  }
}

export async function patchLolTodayMatches() {
  const matches = await crawlingLolTodayMatches()
  const matchEntities = await findLolTodayMatches()
  let cnt = 0

  for (let match of matches) {
    if (match.state === '종료' || match.state === '취소' || match.state === '경기취소') cnt++
    for (let entity of matchEntities) {
      if (entity.home === match.home && entity.away === match.away) {
        await updateTodayLolMatch(entity, match)
        break
      }
    }
  }

  if (cnt === matches.length) {
    app.locals[JobType.LolMatch].cancel()
    logger.info('LOL 매치 업데이트 스케줄러 중단')
  }
}

export async function getLolWeekMatches() {
  const weekMatches = await findLolWeekMatches()
  const group: { [date: string]: LolMatch[]} = {}

  weekMatches.map(match => {
    const date = DateUtils.parseDateString(match.matchDatetime)
    if(!(date in group)) {
      group[date] = []
    }
    group[date].push(match)
  })

  const dto = getWeekMatchesDto()
  for(let date in group) {
    const today = DateUtils.parseDateString(new Date())
    if (date === today) {
      dto.todayMatches = getLolDayMatchesDto(date, group[date])
    }
    dto.weekMatches.push(getLolDayMatchesDto(date, group[date]))
  }

  return dto
}