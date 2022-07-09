import { localTime } from '@/utils/date'
import moment from 'moment'
import { Team, MatchProgress, getTeamCode } from './kbo.utils'
import { KboMatch } from './kboMatch'
import { KboRank } from './kboRank'

export class KboDayMatchPatchReqDto {
  readonly home: Team
  readonly away: Team
  readonly homeScore: number
  readonly awayScore: number
  readonly matchProgress: MatchProgress

  constructor(body: any) {
    this.home = body.home
    this.away = body.away
    this.homeScore = body.homeScore
    this.awayScore = body.awayScore
    this.matchProgress = body.matchProgress
  }
}

export class KboDayMatchGetResDto {
  readonly home: Team
  readonly away: Team
  readonly homeScore: number
  readonly awayScore: number
  readonly homeCode: string
  readonly awayCode: string
  readonly matchProgress: MatchProgress
  readonly matchDate: string
  readonly startTime: string

  constructor(match: KboMatch) {
    this.home = match.home
    this.away = match.away
    this.homeScore = match.homeScore
    this.awayScore = match.awayScore
    this.homeCode = getTeamCode(match.home)
    this.awayCode = getTeamCode(match.away)
    this.matchProgress = match.matchProgress
    this.matchDate = moment(match.matchDate).format('YYYYMMDD')
    this.startTime = match.startTime.toString().split(':').slice(0, 2).join(':')
  }
}

export class KboRankGetResDto {
  readonly rank: number
  readonly name: Team
  readonly played: number
  readonly win: number
  readonly draw: number
  readonly defeat: number
  readonly winRate: number
  readonly gameDiff: number

  constructor(rank: KboRank) {
    this.rank = rank.ranking
    this.name = rank.name
    this.played = rank.played
    this.win = rank.win
    this.draw = rank.draw
    this.defeat = rank.defeat
    this.winRate = rank.winRate
    this.gameDiff = rank.gameDiff
  }
}
