import { MatchProgress, Team } from '@/domain/kbo/domain/model/vo/kbo.vo'
import { DateUtils } from '@/utils/dateUtils'
import { KboMatch } from '../../domain/kbo/domain/model/kboMatch'
import { DatetimeOpts } from '../../utils/dateUtils'

export function createKboMatchEntity(datetimeOpts: DatetimeOpts) {
  const { year, month, day, hour, min, sec, ms } = datetimeOpts
  const entity = new KboMatch()
  entity.matchDatetime = DateUtils.getDatetime({ year, month, day, hour, min, sec, ms })
  entity.matchProgress = '경기전' as MatchProgress
  entity.home = '삼성' as Team
  entity.away = 'KIA' as Team
  entity.homeScore = 0
  entity.awayScore = 0
  return entity
}
