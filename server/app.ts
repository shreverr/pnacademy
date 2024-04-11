import express from 'express'
import 'dotenv/config'
import pinoHttp from 'pino-http'
import logger from './config/logger'
import instantiateModels from './schema/index'
import router from './routes'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(pinoHttp({ logger, useLevel: 'trace' }))
app.use('/v1', router)

instantiateModels()

app.get('/', (req, res) => {
  res.send('Hello World!')
})
export default app
