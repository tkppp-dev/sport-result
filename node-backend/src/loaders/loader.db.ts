import { getLogger } from '@/utils/loggers';
import { DataSource } from 'typeorm';

export async function loadDbConnection(dataSource: DataSource) {
  const logger = getLogger('loadDbConnection()')
  try {
    await dataSource.initialize()
    logger.info('DataSource 초기화 성공')
  } catch (err) {
    logger.info('DataSource 초기화 실패\n', err)
  }
}