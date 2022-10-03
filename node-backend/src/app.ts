import express, { ErrorRequestHandler } from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import 'express-async-errors'
import 'reflect-metadata'

// loader
import { config } from 'dotenv'
config()
import { bootstrapLogger, getLogger } from './utils/loggers'
bootstrapLogger()
import { setupLoader } from './loaders'
setupLoader().then(() => {})

// route
import KboRouter from './domain/kbo/ui/kbo.controller'
import LolRouter from '@/domain/lol/ui/lol.controller'
import AuthRouter from '@/domain/admin/admin.controller'

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
    this.app.use('/api/lol', LolRouter)
    this.app.use('/api/auth', AuthRouter)
  }

  private errorConfig() {
    // 404 Not Found
    this.app.use((req, res, next) => {
      res.sendFile(path.join(__dirname, 'public/index.html'))
    })

    // Internal Server Error
    const errorHandler: ErrorRequestHandler = function (err, req, res, next) {
      const logger = getLogger('MAIN')
      logger.error(err)
      res.status(500).json({ code: 500, message: 'Internal Server Error' })
    }
    this.app.use(errorHandler)
  }
}

const app = new App().app

const port = process.env.PORT || '8080'
app.set('port', port)

app.listen(port, () => {
  const logger = getLogger('SERVER')
  logger.info('server launched at port', port)
})

export { app }