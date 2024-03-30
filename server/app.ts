import express from 'express'
import 'dotenv/config'
import pinoHttp from 'pino-http'
import logger from './config/logger'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(pinoHttp({ logger }))

app.get('/', (req, res) => {
  req.log.debug('Hello, worldd!')
  return res.send('Hello, world!')
})

export default app
