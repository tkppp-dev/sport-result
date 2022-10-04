import path from 'path'
import log4js from 'log4js'
import { configure } from 'log4js'
import { DateUtils } from './dateUtils'
export { getLogger } from 'log4js'

export function bootstrapLogger() {
  const date = new Date()
  const dateString = DateUtils.parseDateString(date)

  configure({
    appenders: {
      out: { type: 'stdout' },
      app: { type: 'dateFile', filename: path.join(__dirname, '..', 'logs', `${dateString}.log`) },
      errorFile: {
        type: 'dateFile',
        filename: path.join(__dirname, '..', 'logs', `${dateString}-error.log`),
      },
      errors: {
        type: 'logLevelFilter',
        level: 'ERROR',
        appender: 'errorFile',
      },
    },
    categories: {
      default: { appenders: ['out', 'app', 'errors'], level: 'debug' },
    },
  })

  const logger = log4js.getLogger()
  logger.level = 'debug'
}
