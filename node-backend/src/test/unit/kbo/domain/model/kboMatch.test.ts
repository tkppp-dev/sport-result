import { loadDbConnection } from '@/loaders/loader.db'
import { MysqlDataSource } from '@/test/helpers/dbConn'
import { KboMatch } from '@/domain/kbo/domain/model/kboMatch'
import { createKboMatchEntity } from '../../../../helpers/createEntity';
import { DatetimeOpts } from '../../../../../utils/dateUtils';

describe('Testing Active Record Method', () => {
  beforeAll(async () => {
    await loadDbConnection(MysqlDataSource)
  })
  
  afterAll(async () => {
    await MysqlDataSource.destroy()
  })

  beforeEach(async () => {
    await KboMatch.clear()
  })

  describe('KboMatch.findTodayMatches()', () => {
    test('should return kbo today matches', async () => {
      const today = new Date()
      const opts: DatetimeOpts = {
        year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate()
      }
      // given
      const todayEntity = await createKboMatchEntity(opts).save()
      opts.day = today.getDate() + 1
      await createKboMatchEntity(opts).save()
  
      // when
      const result = await KboMatch.findTodayMatches()
  
      // then
      expect(result.length).toBe(1)
      expect(result[0]).toEqual(todayEntity)
    })
  })
})
