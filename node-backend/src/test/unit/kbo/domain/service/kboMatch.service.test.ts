import { deleteMonthlyKboSchedule, saveMonthlyKboSchedule } from '@/domain/kbo/domain/service/kboMatch.service'
import { loadDbConnection } from '@/loaders/loader.db'
import { MysqlDataSource } from '@/test/helpers/dbConn'
import { KboMatch } from '@/domain/kbo/domain/model/kboMatch'
import { createKboMatchEntity } from '@/test/helpers/createEntity'
import { KboSchedule, KboScheduleDetail } from '@/domain/kbo/infra/kbo.crawling'
import { DateUtils } from '@/utils/dateUtils';

beforeAll(async () => {
  await loadDbConnection(MysqlDataSource)
})

beforeEach(async () => {
  await KboMatch.clear()
})

afterAll(async () => {
  await MysqlDataSource.destroy()
})

describe('Testing Domain Service - KboMatch', () => {
  const year = 2022,
    month = 9
  describe('deleteMonthlyKboSchedule()', () => {
    test('should delete all matches in 2022/9', async () => {
      // given
      const repository = KboMatch.getRepository()
      for (let i = 0; i < 10; i++) {
        await createKboMatchEntity({ year, month, day: i }).save()
      }

      // when
      await deleteMonthlyKboSchedule(repository, year, month)
      // then
      const entities = await KboMatch.find()
      console.log(entities)
      expect(entities.length).toBe(1)
    })
  })

  describe('saveMonthlyKboSchedule()', () => {
    const matchDetails: KboScheduleDetail[] = [
      {
        startTime: ['18', '30'],
        home: '삼성',
        away: 'KIA',
        homeScore: 0,
        awayScore: 0,
        matchProgress: '경기전',
      },
    ]
    test('should save matches in 2022/9', async () => {
      // given
      const repository = KboMatch.getRepository()
      const matchSchedules: KboSchedule[] = [
        {
          matchDate: [2022, 9, 8],
          matchInfo: matchDetails,
        },
        {
          matchDate: [2022, 9, 9],
          matchInfo: matchDetails,
        },
        { matchDate: [2022, 9, 10], 
          matchInfo: matchDetails 
        }]
      
      // when
      await saveMonthlyKboSchedule(repository, matchSchedules)

      // then
      const matches = await KboMatch.find()
      expect(matches.length).toBe(3)
      expect(matches[0].matchDatetime).toEqual(DateUtils.getDatetime({
        year: 2022, month: 9, day: 8, hour: 18, min: 30
      }))
      expect(matches[0].matchProgress).toBe(matchDetails[0].matchProgress)
      expect(matches[0].home).toBe(matchDetails[0].home)
      expect(matches[0].away).toBe(matchDetails[0].away)
      expect(matches[0].homeScore).toBe(matchDetails[0].homeScore)
      expect(matches[0].awayScore).toBe(matchDetails[0].awayScore)
    })
  })
})
