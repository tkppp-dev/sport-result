import 'module-alias/register';
import { config } from 'dotenv';
config();

import app from '@/app';
import Debug from 'debug';
import http from 'http';

const debug = Debug('node-backend:server');
import { bootstrapLogger, getLogger } from '@/utils/loggers';
bootstrapLogger();

import { MysqlDateSource } from '@/datasource'
import { setDefaultScheduler, setupSchedulers } from '@/scheduler';

MysqlDateSource.initialize()
  .then(async () => {
    const logger = getLogger('DATABASE')
    logger.info('Data Source has been initialized!')
    
    // set scheduler
    await setupSchedulers()
    await setDefaultScheduler()

  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err)
  })

const port = normalizePort(process.env.PORT || '80');
app.set('port', port);

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => {
  const logger = getLogger('SERVER')
  logger.info('server launched at port', port)
});
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: { syscall: string, code: string }) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
  debug('Listening on ' + bind);
}
