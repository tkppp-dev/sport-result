import { DateUtils } from '@/utils/dateUtils'

describe('DateUtils class test', () => {
  const year = 2022,
    month = 9,
    day = 7
  const hour = 18,
    min = 30,
    sec = 30,
    ms = 123

  describe('DateUtils.getDatetime(datetimeOpts = {})', () => {
    test('should apply datetimeOpts to Date with argument', () => {
      const date = DateUtils.getDatetime({ year, month, day, hour, min, sec, ms })

      expect(date.getFullYear()).toBe(year)
      expect(date.getMonth() + 1).toBe(month)
      expect(date.getDate()).toBe(day)
      expect(date.getHours()).toBe(hour)
      expect(date.getMinutes()).toBe(min)
      expect(date.getSeconds()).toBe(sec)
      expect(date.getMilliseconds()).toBe(ms)
    })

    test('should apply today date and 0 times when no arugment', () => {
      const date = DateUtils.getDatetime()
      const now = new Date()

      expect(date.getFullYear()).toBe(now.getFullYear())
      expect(date.getMonth()).toBe(now.getMonth())
      expect(date.getDate()).toBe(now.getDate())
      expect(date.getHours()).toBe(0)
      expect(date.getMinutes()).toBe(0)
      expect(date.getSeconds()).toBe(0)
      expect(date.getMilliseconds()).toBe(0)
    })
  })

  describe('DateUtils.parseDateString()', () => {
    test('should return dateString with default seperator', () => {
      const date1 = DateUtils.getDatetime({ year, month: 9, day: 7 })
      const date2 = DateUtils.getDatetime({ year, month: 12, day: 12 })
      const dateString1 = DateUtils.parseDateString(date1)
      const dateString2 = DateUtils.parseDateString(date2)

      expect(dateString1).toBe('2022-09-07')
      expect(dateString2).toBe('2022-12-12')
    })

    test('should return dateString with custom seperator', () => {
      const date = DateUtils.getDatetime({ year, month, day })
      const seperator = '/'
      const dateString = DateUtils.parseDateString(date, seperator)
      expect(dateString).toBe(`${year}${seperator}0${month}${seperator}0${day}`)
    })
  })

  describe('DateUtils.parseHourMinuteString()', () => {
    test('should return hourMinuteString with default seperator', () => {
      const time1 = DateUtils.getDatetime({ hour: 0, min: 0 })
      const time2 = DateUtils.getDatetime({ hour: 18, min: 30 })
      const hmString1 = DateUtils.parseHourMinuteString(time1)
      const hmString2 = DateUtils.parseHourMinuteString(time2)

      expect(hmString1).toBe('00:00')
      expect(hmString2).toBe('18:30')
    })

    test('should return hourMinuteString with custom seperator', () => {
      const time = DateUtils.getDatetime({ hour: 18, min: 30 })
      const seperator = '.'
      const hmString = DateUtils.parseHourMinuteString(time, seperator)
      expect(hmString).toBe('18.30')
    })
  })

  describe('DateUtils.addZero()', () => {
    test('should return "0X" when param < 10', () => {
      expect(DateUtils.addZero(9)).toBe('09')
      expect(DateUtils.addZero('7')).toBe('07')
    })
  })

  describe('DateUtils.getKorDayOfWeek', () => {
    test('should return Korean Date string when param is Date Object', () => {
      // given
      const korDate = ['(일)', '(월)', '(화)', '(수)', '(목)', '(금)', '(토)']
      const date = new Date()

      // when, then
      for(let i=0; i<7; i++) {
        const day = date.getDay()
        expect(DateUtils.getKorDayOfWeek(date)).toBe(korDate[day])
        date.setDate(date.getDate() + 1)
      }
    })

    test('should return Korean Date string when param is date string', () => {
      // given
      const korDate = ['(일)', '(월)', '(화)', '(수)', '(목)', '(금)', '(토)']
      const date = new Date()

      // when, then
      for(let i=0; i<7; i++) {
        const day = date.getDay()
        expect(DateUtils.getKorDayOfWeek(date.toString())).toBe(korDate[day])
        date.setDate(date.getDate() + 1)
      }
    })
  })
})
