import { loadDbConnection } from '@/loaders/loader.db'
import { MysqlDataSource } from '@/test/helpers/dbConn'
import { teamEnum } from '@/domain/kbo/domain/model/vo/kbo.vo'
import { KboRank } from '@/domain/kbo/domain/model/kboRank'
import { findKboRankOrderByAsc, updateKboRanking } from '@/domain/kbo/domain/service/kboRank.service'
import { Repository } from 'typeorm'


describe('Testing Domain Service - KboRank', () => {
  let repository: Repository<KboRank>

  beforeAll(async () => {
    await loadDbConnection(MysqlDataSource)
    repository = KboRank.getRepository()
    await KboRank.save(
      teamEnum.map((team, idx) => {
        return KboRank.create({
          ranking: idx + 1,
          name: team,
          played: 0,
          win: 0,
          draw: 0,
          defeat: 0,
          winRate: 0,
          gameDiff: 0,
        })
      })
    )
  })
  
  afterAll(async () => {
    await KboRank.clear()
    await MysqlDataSource.destroy()
  })

  describe('findKboRankOrderByAsc()', () => {
    test('should return ordered data by ranking column', async () => {
      // when
      const result = await findKboRankOrderByAsc(repository)

      // then
      result.map((entity, idx) => {
        expect(entity.ranking).toBe(idx + 1)
      })
    })
  })

  describe('updateKboRanking()', () => {
    test('should update rank entity correctly', async () => {
      // given
      const newRank = {
        name: '삼성',
        played: 1,
        win: 1,
        draw: 0,
        defeat: 0,
        winRate: 1,
        gameDiff: 0,
      }
      const firstRankEntity = (await KboRank.findOne({ where: { ranking: 1 } })) as KboRank

      // then
      await updateKboRanking(repository, firstRankEntity, newRank)

      // then
      const { name, played, win, draw, defeat, winRate, gameDiff } = (await KboRank.findOne({
        where: { ranking: 1 },
      })) as KboRank

      expect({ name, played, win, draw, defeat, winRate, gameDiff }).toEqual(newRank)
    })
  })
})
