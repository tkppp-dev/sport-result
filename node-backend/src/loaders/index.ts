import { getLogger } from '@/utils/loggers';
import { loadDbConnection } from './loader.db';
import { loadScheduler } from './loader.scheduler';
import { MysqlDateSource } from '@/config/config.db'

export async function setupLoader() {
  const logger = getLogger('setupLoader()')
  logger.info('Loader setup start')

  await loadDbConnection(MysqlDateSource)
  await loadScheduler()
  
  logger.info('Loader setup end') 
}
