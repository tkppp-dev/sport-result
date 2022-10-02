import { DateUtils } from '@/utils/dateUtils';
import { LolMatch } from '../domain/model/lol.match';
import { MatchProgress, lolTeamAlias } from '../domain/model/lol.vo';

export interface LolDayMatchDto {
  startTime: string
  state: MatchProgress,
  home: string,
  away: string,
  homeScore: number,
  awayScore: number
}

export interface LolDayMatchesDto {
  date: string,
  matches: LolDayMatchDto[]
}

export interface LolWeekMatchesDto {
  todayMatches: null | LolDayMatchesDto
  weekMatches: LolDayMatchesDto[] 
}

export function getLolDayMatchesDto(date: string, entities: LolMatch[] = []): LolDayMatchesDto {
  const matches = entities.map(entity => {
    return {
      state: entity.matchProgress,
      startTime: DateUtils.parseHourMinuteString(entity.matchDatetime),
      home: lolTeamAlias[entity.home],
      away: lolTeamAlias[entity.away],
      homeScore: entity.homeScore,
      awayScore: entity.awayScore
    }
  })
  return {
    date: `${date} ${DateUtils.getKorDayOfWeek(date)}`,
    matches
  }
}

export function getWeekMatchesDto(): LolWeekMatchesDto {
  return {
    todayMatches: null,
    weekMatches: []
  }
}