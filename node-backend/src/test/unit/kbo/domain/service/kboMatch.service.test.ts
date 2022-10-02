import { deleteMonthlyKboSchedule, saveMonthlyKboSchedule, updateKboMatch } from '@/domain/kbo/domain/service/kboMatch.service'
import { loadDbConnection } from '@/loaders/loader.db'
import { MysqlDataSource } from '@/test/helpers/dbConn'
import { KboMatch } from '@/domain/kbo/domain/model/kboMatch'
import { createKboMatchEntity } from '@/test/helpers/createEntity'
import { KboSchedule, KboScheduleDetail } from '@/domain/kbo/infra/kbo.crawling'
import { DateUtils } from '@/utils/dateUtils';
import { MatchProgress } from '@/domain/kbo/domain/model/vo/kbo.vo'

describe('Testing Domain Service - KboMatch', () => {
  const year = 2022, month = 9

  beforeAll(async () => {
    await loadDbConnection(MysqlDataSource)
  })
  
  afterAll(async () => {
    await MysqlDataSource.destroy()
  })

  beforeEach(async () => {
    await KboMatch.clear()
  })
  
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

  describe('updateKboMatch()', () => {
    const match = createKboMatchEntity()
    const suit1 = ['경기취소', '종료']
    const suit2 = ['1회초' , "1회말" , "2회초" , "2회말", "3회초" , "3회말" , "4회초" , "4회말", "5회초" , "5회말" , 
    "6회초" , "6회말", "7회초" , "7회말" , "8회초", "8회말" , "9회초" , "9회말" , "10회초" , "10회말" , "11회초" , 
    "11회말" , "12회초" , "12회말" , "경기전"]
    test('should return 0 when matchProgress is "경기취소" or "종료"', async () => {      
      suit1.map(async (matchProgress) => {
        match.matchProgress = matchProgress as MatchProgress
        // when
        let result = await updateKboMatch(match, [])
        // then
        expect(result).toBe(0)
      })
    })

    test('should return 1 when matchProgress is not "경기취소", "종료"', () => {
      suit2.map(async (matchProgress) => {
        match.matchProgress = matchProgress as MatchProgress

        // when
        let result = await updateKboMatch(match, [])
        // then
        expect(result).toBe(1)
      })
    })

    test('shoud update entity when match teams equals', async () => {
      // given
      match.matchProgress = '1회초'
      const entity = await KboMatch.save(match)
      const currentMatches = [{
        home: match.home,
        away: match.away,
        homeScore: 10,
        awayScore: 5,
        matchProgress: '2회초'
      }]
      // when
      await updateKboMatch(entity, currentMatches)
      
      // then
      let data = (await KboMatch.find())[0]
      expect(data.home).toBe(currentMatches[0].home)
      expect(data.away).toBe(currentMatches[0].away)
      expect(data.homeScore).toBe(currentMatches[0].homeScore)
      expect(data.awayScore).toBe(currentMatches[0].awayScore)
      expect(data.matchProgress).toBe(currentMatches[0].matchProgress)
      
    })
  })
})
