import { MysqlDateSource } from '@/config/config.db';
import { crawlingLoLMonthSchedule } from '@/domain/lol/infra/lol.crawling';
import { DateUtils } from '@/utils/dateUtils';
import { LolMatch } from '../domain/model/lol.match';
import { deleteMonthlyLolSchedule, findLolWeekMatches, saveMonthlyLolSchedule } from '../domain/service/lol.match.domin.service';
import { getLolDayMatchesDto, getWeekMatchesDto } from '../utils/lol.dto';

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

export async function pathcLolTodayMatches() {

}

export async function getLolWeekMatches() {
  const weekMatches = await findLolWeekMatches(LolMatch.getRepository())
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
    console.log(date, today)
    if (date === today) {
      dto.todayMatches = getLolDayMatchesDto(date, group[date])
    }
    dto.weekMatches.push(getLolDayMatchesDto(date, group[date]))
  }

  return dto
}