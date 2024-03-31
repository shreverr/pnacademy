import app from './app'
import { connectDatabase, sequelize } from './config/database'
import logger from './config/logger'

logger.info('/////////////////////////////////////////////')
logger.info('/////////////////////////////////////////////')
logger.info('//                                         //')
logger.info('//          Pnacademy Web Server           //')
logger.info('//                                         //')
logger.info('/////////////////////////////////////////////')
logger.info('/////////////////////////////////////////////')

const port = process.env.PORT ?? 3000

void connectDatabase()

void sequelize.sync()
  .then(() => {
    console.log('Database & tables created!')
  })
  .catch((error) => {
    console.log(`Error in syncing to DB: ${error}`)
  })

app.listen(port, () => {
  logger.info(`Server listening at http://localhost:${port}`)
})
