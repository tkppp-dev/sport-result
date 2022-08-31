import { MysqlDateSource } from '@/config/config.db'
import { getLogger } from '@/utils/loggers';

export default async function loadDbConnection() {
  const logger = getLogger('loadDbConnection()')
  try {
    await MysqlDateSource.initialize()
    logger.info('DataSource 초기화 성공')
  } catch (err) {
    logger.info('DataSource 초기화 실패\n', err)
  }
}