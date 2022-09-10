import { DateUtils } from '@/utils/dateUtils';
import { LckMatch } from './lckMatch';

export class LckDayMatchDto {
  date: string
  matches: {
    state: string,
    home: string,
    away: string,
    homeScore: number,
    awayScore: number
  }[]

  constructor(date: string, matches: LckMatch[]) {
    this.date = date + ` ${DateUtils.getKorDayOfWeek(date)}`
    this.matches = matches.map((match => {
      return {
        state: match.matchProgress,
        home: match.home,
        away: match.away,
        homeScore: match.homeScore,
        awayScore: match.awayScore
      }
    }))
  }
}

export class LckWeekMatchDto {
  todayMatches: LckDayMatchDto | null = null
  weekMatches: LckDayMatchDto[] = []
}