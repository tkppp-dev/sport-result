import { MysqlDateSource } from "@/config/config.db"
import { KboRank } from "../domain/model/kboRank"
import { Team } from "../domain/model/vo/kbo.vo"
import { findKboRankOrderByAsc, updateKboRanking } from "../domain/service/kboRank.service"
import { crawlingKboTeamRanking } from "../infra/kbo.crawling"
import { KboRankGetResDto } from "../utils/kbo.dto"

export async function putKboTeamRank() {
  const ranking = await crawlingKboTeamRanking()
  const qr = MysqlDateSource.createQueryRunner()
  qr.connect()

  const repository = qr.manager.getRepository(KboRank)
  const rankEntities = await findKboRankOrderByAsc(repository)
  let transactionError: Error | undefined
  qr.startTransaction()
  try {
    if (rankEntities.length === 0) {
      for (let i = 0; i < 10; i++) {
        const entity = repository.create({
          ranking: i + 1,
          name: ranking[i].name as Team,
          played: ranking[i].played,
          win: ranking[i].win,
          draw: ranking[i].draw,
          defeat: ranking[i].defeat,
          winRate: ranking[i].winRate,
          gameDiff: ranking[i].gameDiff,
        })

        await repository.save(entity)
      }
    } else {
      for (let i = 0; i < 10; i++) {
        updateKboRanking(repository, rankEntities[i], ranking[i])
      }
    }
    await qr.commitTransaction()
  } catch (err) {
    await qr.rollbackTransaction()
    transactionError = err as Error
  } finally {
    await qr.release()
    if (transactionError !== undefined) throw transactionError
  }
}

export async function getKboTeamRank() {
  const ranks = await findKboRankOrderByAsc(KboRank.getRepository())

  return ranks.map((entity) => new KboRankGetResDto(entity))
}
