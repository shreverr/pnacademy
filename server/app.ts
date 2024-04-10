import express from 'express'
import 'dotenv/config'
import pinoHttp from 'pino-http'
import logger from './config/logger'
import instantiateModels from './schema/index'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(pinoHttp({ logger, useLevel: 'debug' }))

instantiateModels()

export default app
