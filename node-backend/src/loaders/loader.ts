import { getLogger } from '@/utils/loggers';
import loadDbConnection from './loader.db';
import loadScheduler from './loader.scheduler';

export default async function setupLoader() {
  const logger = getLogger('setupLoader()')
  logger.info('Loader setup start')

  await loadDbConnection()
  await loadScheduler()
  
  logger.info('Loader setup end') 
}
