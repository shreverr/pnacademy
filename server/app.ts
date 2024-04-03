import express from 'express'
import 'dotenv/config'
import pinoHttp from 'pino-http'
import logger from './config/logger'
import { AppError } from './lib/appError'
import { handler } from './lib/errorHandler'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(pinoHttp({ logger }))

app.get('/', (req, res) => {
  try{
    throw new AppError('ResourceNotFound', 404, 'Resource not found', true)
  } catch (err: any) {
    handler.handleError(err, res)
  }
})

export default app
