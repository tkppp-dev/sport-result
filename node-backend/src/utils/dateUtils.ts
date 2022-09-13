export interface DatetimeOpts {
  year?: number
  month?: number
  day?: number
  hour?: number
  min?: number
  sec?: number
  ms?: number
}

export class DateUtils {
  static getDatetime(opts: DatetimeOpts = {}) {
    const { year, month, day, hour, min, sec, ms } = opts
    const date = new Date()

    if (year !== undefined) {
      date.setFullYear(year)
    }

    if (month !== undefined) {
      date.setMonth(month - 1)
    }

    if (day !== undefined) {
      date.setDate(day)
    }

    if (hour !== undefined) {
      date.setHours(hour)
    } else {
      date.setHours(0)
    }

    if (min !== undefined) {
      date.setMinutes(min)
    } else {
      date.setMinutes(0)
    }

    if (sec !== undefined) {
      date.setSeconds(sec)
    } else {
      date.setSeconds(0)
    }

    if (ms !== undefined) {
      date.setMilliseconds(ms)
    } else {
      date.setMilliseconds(0)
    }

    return date
  }

  static parseDateString(date: Date, seperator: string = '-') {
    return [
      date.getFullYear(),
      this.addZero(date.getMonth() + 1),
      this.addZero(date.getDate()),
    ].join(seperator)
  }

  static parseHourMinuteString(date: Date, seperator: string = ':') {
    return [this.addZero(date.getHours()), this.addZero(date.getMinutes())].join(seperator)
  }

  static addZero(param: number | string): string {
    if (typeof param === 'string') param = parseInt(param)
    if (param < 10) return '0' + param
    else return '' + param
  }

  static getKorDayOfWeek(date: string | Date) {
    let dayOfWeek: number
    if (typeof date === 'string') {
      dayOfWeek = new Date(date).getDay()
    } else {
      dayOfWeek = date.getDay()
    }
  
    let korDayOfWeek
    switch (dayOfWeek) {
      case 0:
        korDayOfWeek = '(일)'
        break
      case 1:
        korDayOfWeek = '(월)'
        break
      case 2:
        korDayOfWeek = '(화)'
        break
      case 3:
        korDayOfWeek = '(수)'
        break
      case 4:
        korDayOfWeek = '(목)'
        break
      case 5:
        korDayOfWeek = '(금)'
        break
      case 6:
        korDayOfWeek = '(토)'
        break
      default:
        break
    }
  
    return korDayOfWeek
  }
}
