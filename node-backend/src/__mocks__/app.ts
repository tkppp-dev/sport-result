import express from 'express'

const app = express()


app.locals = {
  kboMatch: {
    cancel: jest.fn()
  },
  kboRank: {
    cancel: jest.fn()
  },
  lckMatch: {
    cancel: jest.fn()
  },
}

export { app }