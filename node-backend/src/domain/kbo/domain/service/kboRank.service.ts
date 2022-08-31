import { KboRank } from '../model/kboRank'
import { Repository } from 'typeorm'
import { Team } from '../model/vo/kbo.vo'

export async function findKboRankOrderByAsc(repository: Repository<KboRank>) {
  return await repository.find({
    order: {
      ranking: 'ASC',
    },
  })
}

export async function updateKboRanking(
  repository: Repository<KboRank>,
  rank: KboRank,
  newRank: any
) {
  rank.name = newRank.name as Team
  rank.played = newRank.played
  rank.win = newRank.win
  rank.draw = newRank.draw
  rank.defeat = newRank.defeat
  rank.winRate = newRank.winRate
  rank.gameDiff = newRank.gameDiff
  
  await repository.save(rank)
}
