import { localDate, localTime } from '@/utils/date'
import moment from 'moment'
import { Repository } from 'typeorm'
import { KboMatchDetail, KboSchedule } from '../../infra/kbo.crawling'
import { KboMatch } from '../model/kboMatch'
import { MatchProgress, Team } from '../model/vo/kbo.vo'

export async function deleteMonthlyKboSchedule(
  repository: Repository<KboMatch>,
  year: number,
  month: number
) {
  await repository
    .createQueryBuilder()
    .delete()
    .where('matchDate >= :start', {
      start: moment(localDate({ year, month, day: 1 })).format('YYYY-MM-DD'),
    })
    .andWhere('matchDate <= :end', {
      end: moment(localDate({ year, month: month + 1, day: 0 })).format('YYYY-MM-DD'),
    })
    .execute()
}

export async function saveMonthlyKboSchedule(
  repository: Repository<KboMatch>,
  matchSchedules: KboSchedule[],
  year: number,
  month: number
) {
  for (let daySchedules of matchSchedules) {
    const matchDate = localDate({ year, month, day: daySchedules.matchDate[2] })
    for (let match of daySchedules.matchInfo) {
      const entity = repository.create({
        matchDate,
        startTime: localTime({
          hour: parseInt(match.startTime[0]),
          minute: parseInt(match.startTime[1]),
        }),
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

export async function updateKboMatch(match: KboMatch, currentMatchDetails: KboMatchDetail[]): Promise<0 | 1> {
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
