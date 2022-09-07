import { MatchProgress, Team } from '@/domain/kbo/domain/model/vo/kbo.vo'
import { DateUtils } from '@/utils/dateUtils'
import { KboMatch } from '../../domain/kbo/domain/model/kboMatch'
import { DatetimeOpts } from '../../utils/dateUtils';

export function createKboMatchEntity(datetimeOpts: DatetimeOpts) {
  const { year, month, day, hour, min, sec, ms } = datetimeOpts
  return KboMatch.create({
    matchDatetime: DateUtils.getDatetime({ year, month, day, hour, min, sec, ms}),
    matchProgress: '경기전' as MatchProgress,
    home: '삼성' as Team,
    away: 'KIA' as Team,
    homeScore: 0,
    awayScore: 0,
  })
}
