import { Repository } from 'typeorm'
import { KboMatchDetail, KboSchedule } from '../../infra/kbo.crawling'
import { KboMatch } from '../model/kboMatch'
import { MatchProgress, Team } from '../model/vo/kbo.vo'
import { DateUtils } from '@/utils/dateUtils'

export async function deleteMonthlyKboSchedule(
  repository: Repository<KboMatch>,
  year: number,
  month: number
) {
  await repository
    .createQueryBuilder()
    .delete()
    .where('matchDatetime >= :start and matchDatetime <= :end', {
      start: DateUtils.getDatetime({ year, month, day: 1 }),
      end: DateUtils.getDatetime({ year, month: month + 1, day: 0 }),
    })
    .execute()
}

export async function saveMonthlyKboSchedule(
  repository: Repository<KboMatch>,
  matchSchedules: KboSchedule[]
) {
  for (let daySchedules of matchSchedules) {
    const matchDate = daySchedules.matchDate
    for (let match of daySchedules.matchInfo) {
      const matchDatetime = DateUtils.getDatetime({
        year: matchDate[0],
        month: matchDate[1],
        day: matchDate[2],
        hour: parseInt(match.startTime[0]),
        min: parseInt(match.startTime[1]),
      })
      const entity = repository.create({
        matchDatetime,
        matchProgress: match.matchProgress as MatchProgress,
        home: match.home as Team,
        away: match.away as Team,
        homeScore: match.homeScore,
        awayScore: match.awayScore,
      })
      await repository.save(entity)
    }
  }
}

export async function updateKboMatch(
  match: KboMatch,
  currentMatchDetails: KboMatchDetail[]
): Promise<0 | 1> {
  if (match.matchProgress === '경기취소' || match.matchProgress === '종료') {
    return 1
  } else {
    for (let matchDetail of currentMatchDetails) {
      if (matchDetail.matchProgress === '경기전') continue

      if (matchDetail.home === match.home && matchDetail.away === match.away) {
        match.homeScore = matchDetail.homeScore
        match.awayScore = matchDetail.awayScore
        match.matchProgress = matchDetail.matchProgress as MatchProgress
        await KboMatch.save(match)
        break
      }
    }
  }
  return 0
}
