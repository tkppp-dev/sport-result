import { jest } from '@jest/globals'
import { MysqlDateSource } from '@/config/config.db'
import { mockQueryRunner } from '@/test/helpers/mockQueryRunner'
import { getKboDayMatches, putKboMonthSchedule, patchKboMatches } from '@/domain/kbo/service/kbo.match.service';
import { KboSchedule } from '@/domain/kbo/infra/kbo.crawling'
import { QueryRunner } from 'typeorm'
import * as KboCrawler from '@/domain/kbo/infra/kbo.crawling'
import * as KboDomainService from '@/domain/kbo/domain/service/kboMatch.service'
import { KboMatch } from '@/domain/kbo/domain/model/kboMatch'
import { createKboMatchEntity } from '../../../helpers/createEntity'
import { JobType } from '@/config/config.scheduler'
import { app } from '@/app'

jest.mock('@/app')
jest.mock('@/config/config.db')
const mockDatasouce = jest.mocked(MysqlDateSource, true)
jest.mock('@/domain/kbo/domain/service/kboMatch.service')
const mockDomainService = jest.mocked(KboDomainService, true)
jest.mock('@/domain/kbo/infra/kbo.crawling')
const mockCrawler = jest.mocked(KboCrawler, true)
jest.mock('@/domain/kbo/domain/model/kboMatch')

describe('Testing Service Layer - KboMatch', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    mockDatasouce.createQueryRunner.mockReturnValue(mockQueryRunner as unknown as QueryRunner)
  })

  describe('putKboMonthSchedule()', () => {
    const year = 2022,month = 9, day = 10

    test('should commit transaction when error didn`t occur', async () => {
      // given
      const schedules = [
        {
          matchDate: [year, month, day],
          matchInfo: [],
        } as KboSchedule,
      ]
      mockCrawler.crawlingKboSchedule.mockResolvedValue(schedules)

      // when
      await putKboMonthSchedule(year, month)

      // then
      expect(mockQueryRunner.connect).toHaveBeenCalledTimes(1)
      expect(mockQueryRunner.startTransaction).toHaveBeenCalledTimes(1)
      expect(mockDomainService.deleteMonthlyKboSchedule).toHaveBeenCalledWith(
        undefined,
        year,
        month
      )
      expect(mockDomainService.saveMonthlyKboSchedule).toHaveBeenCalledWith(undefined, schedules)
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalledTimes(1)
      expect(mockQueryRunner.release).toHaveBeenCalledTimes(1)
    })

    test('shoud rollback transaction when error occured', async () => {
      mockDomainService.deleteMonthlyKboSchedule.mockRejectedValue('Error occured')

      let errMessage
      try {
        await putKboMonthSchedule(year, month)
      } catch (err: any) {
        errMessage = err
      }

      // then
      expect(mockQueryRunner.connect).toHaveBeenCalledTimes(1)
      expect(mockQueryRunner.startTransaction).toHaveBeenCalledTimes(1)
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalledTimes(1)
      expect(mockQueryRunner.release).toHaveBeenCalledTimes(1)
      expect(errMessage).toBe('Error occured')
    })
  })

  describe('getKboDayMatches()', () => {
    test('should return KboDayMatchGetResDto array', async () => {
      // given
      const mockKboMatch = jest.mocked(KboMatch, true)
      const datetimeOpts = { year: 2022, month: 9, day: 10, hour: 18, min: 30 }
      const todayMatches = [createKboMatchEntity(datetimeOpts)]
      mockKboMatch.findTodayMatches.mockResolvedValue(todayMatches)
      // when
      const result = await getKboDayMatches()

      // then
      expect(result[0].home).toBe(todayMatches[0].home)
      expect(result[0].away).toBe(todayMatches[0].away)
      expect(result[0].homeScore).toBe(todayMatches[0].homeScore)
      expect(result[0].awayScore).toBe(todayMatches[0].awayScore)
      expect(result[0].matchDate).toBe('20220910')
      expect(result[0].startTime).toBe('18:30')
    })
  })

  describe('patchKboMatches()', () => {
    beforeAll(() => {
      mockCrawler.crawlingKboMatchDetail.mockResolvedValue([])
    })
    
    const matches = [createKboMatchEntity()]
    const mockDomain = jest.mocked(KboMatch, true)

    test('should stop KBO Match update scheduler when flag value is 0', async () => {
      mockDomain.findTodayMatches.mockResolvedValue(matches)
      mockDomainService.updateKboMatch.mockResolvedValue(0)

      // when
      await patchKboMatches()

      // then
      expect(mockCrawler.crawlingKboMatchDetail).toHaveBeenCalled()
      expect(mockDomain.findTodayMatches).toHaveBeenCalled()
      expect(mockDomainService.updateKboMatch).toHaveBeenCalledTimes(matches.length)
      expect(app.locals[JobType.KboMatch].cancel).toHaveBeenCalled()
    })

    test('should update match and dont stop scheduler when flag value greater than 0', async () => {
      mockDomain.findTodayMatches.mockResolvedValue(matches)
      mockDomainService.updateKboMatch.mockResolvedValue(1)

      // when
      await patchKboMatches()

      // then
      expect(mockCrawler.crawlingKboMatchDetail).toHaveBeenCalled()
      expect(mockDomain.findTodayMatches).toHaveBeenCalled()
      expect(mockDomainService.updateKboMatch).toHaveBeenCalledTimes(matches.length)
      expect(app.locals[JobType.KboMatch].cancel).not.toHaveBeenCalled()
    })
  })
})
