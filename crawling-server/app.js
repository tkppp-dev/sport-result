import express from 'express'
import http from 'http'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import indexRouter from './routes/index.js'
import dotenv from 'dotenv'

const app = express();
dotenv.config()

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error()
  err.staus = 404
  err.message = 'REQUEST_NOT_FOUND'
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  console.error('Error Code : ' + err.status)
  console.error('Error Message : ' + err.message)

  res.status(500)
  res.send(err)
});

const port = process.env.PORT || '3000'
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => {
  console.log('Server successfully load at PORT : ' + port)
});

export default app
