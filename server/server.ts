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

const server = app.listen(port, () => {
  logger.info(`Server listening at http://localhost:${port}`)
})

process.on('uncaughtException', (err) => {
  // log the exception
  logger.fatal(err, 'uncaught exception detected');
  // shutdown the server gracefully
  server.close(() => {
    process.exit(1); // then exit
  });

  // If a graceful shutdown is not achieved after 1 second,
  // shut down the process completely
  setTimeout(() => {
    process.abort(); // exit immediately and generate a core dump file
  }, 1000).unref()
  process.exit(1);
});
