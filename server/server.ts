import app from './app'
import logger from './config/logger'

logger.info('/////////////////////////////////////////////')
logger.info('/////////////////////////////////////////////')
logger.info('//                                         //')
logger.info('//          Pnacademy Web Server           //')
logger.info('//                                         //')
logger.info('/////////////////////////////////////////////')
logger.info('/////////////////////////////////////////////')

const port = process.env.PORT ?? 3000

app.listen(port, () => {
  logger.info(`Server listening at http://localhost:${port}`)
})
