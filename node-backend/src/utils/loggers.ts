import path from 'path';
import log4js from 'log4js';
import { configure } from 'log4js';
import { localDate } from './date';
export { getLogger } from 'log4js';

export function bootstrapLogger() {
  const date = localDate();
  const strDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  configure({
    appenders: {
      out: { type: 'stdout' },
      app: { type: 'file', filename: path.join(__dirname, '..', 'logs', `${strDate}.log`) }
    },
    categories: {
      default: { appenders: ['out', 'app'], level: 'debug' }
    }
  });

  const logger = log4js.getLogger();
  logger.level = 'debug';
}
