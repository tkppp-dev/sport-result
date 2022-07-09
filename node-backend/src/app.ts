import express, { ErrorRequestHandler } from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import 'reflect-metadata'
import 'express-async-errors'

import KboRouter from './domain/kbo/kbo.controller'
import LckRouter from '@/domain/lck/lck.controller'
import { getLogger } from './utils/loggers'

class App {
  public app: express.Application

  constructor() {
    this.app = express()
    this.config()
    this.routerSetup()
    this.errorConfig()
  }

  private config() {
    this.app.use(logger('dev'))
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: false }))
    this.app.use(cookieParser())
    this.app.use(express.static(path.join(__dirname, 'public')))
  }

  private routerSetup() {
    this.app.use('/api/kbo', KboRouter)
    this.app.use('/api/lck', LckRouter)
  }

  private errorConfig() {
    // 404 Not Found
    this.app.use((req, res, next) => {
      res.sendFile(path.join(__dirname, 'public/index.html'))
    })

    const errorHandler: ErrorRequestHandler = function (err, req, res, next) {
      const logger = getLogger('MAIN')
      if (err.status === 404) {
        res.status(404).json({ code: 404, message: 'Not Found Error' })
      } else {
        logger.error(err)
        res.status(500).json({ code: 500, message: 'Internal Server Error'})
      }
    }
    this.app.use(errorHandler)
  }
}

export default new App().app
