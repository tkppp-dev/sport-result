import moment from 'moment-timezone'

export type DateOptions = { year?: number; month?: number; day?: number }
export type TimeOptions = { hour?: number; minute?: number; second?: number }

export function getDate() {
  const now = moment().tz('Asia/Seoul').format('YYYY-MM-DD hh:mm:ss')
  return new Date(now)
}

export function getKorDayOfWeek(date: string | Date) {
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

export function localDate(dateOpt: DateOptions = {}) {
  const now = getDate()

  if (dateOpt.year !== undefined) {
    now.setFullYear(dateOpt.year)
  }
  if (dateOpt.month !== undefined) {
    now.setMonth(dateOpt.month - 1)
  }
  if (dateOpt.day !== undefined) {
    now.setDate(dateOpt.day)
  }
  return now
}

export function parseMonthString(month: number) {
  if (month < 10) {
    return `0${month}`
  }
  return `${month}`
}

export function parseDayString(day: number) {
  if (day < 10) {
    return `0${day}`
  }
  return `${day}`
}

export function localTime(timeOpt: TimeOptions = {}) {
  const now = getDate()

  if (timeOpt.hour !== undefined) {
    now.setHours(timeOpt.hour)
  }

  if (timeOpt.minute !== undefined) {
    now.setMinutes(timeOpt.minute)
  }

  if (timeOpt.second !== undefined) {
    now.setSeconds(timeOpt.second)
  } else {
    now.setSeconds(0)
  }
  return now
}

export function localDatetime(datetimeOpt: DateOptions & TimeOptions) {
  const now = getDate()

  if (datetimeOpt.year !== undefined) {
    now.setFullYear(datetimeOpt.year)
  }

  if (datetimeOpt.month !== undefined) {
    now.setMonth(datetimeOpt.month - 1)
  }

  if (datetimeOpt.day !== undefined) {
    now.setDate(datetimeOpt.day)
  }

  if (datetimeOpt.hour !== undefined) {
    now.setHours(datetimeOpt.hour)
  }

  if (datetimeOpt.minute !== undefined) {
    now.setMinutes(datetimeOpt.minute)
  }

  if (datetimeOpt.second !== undefined) {
    now.setSeconds(datetimeOpt.second)
  }

  return now
}
