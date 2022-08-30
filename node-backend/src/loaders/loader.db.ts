import { MysqlDateSource } from '@/config/datasource'
import { getLogger } from '@/utils/loggers';
import 'reflect-metadata'

MysqlDateSource.initialize()
  .then(async () => {
    const logger = getLogger('DATABASE')
    logger.info('Data Source has been initialized!')
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err)
  })