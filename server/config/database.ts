import { Sequelize } from 'sequelize'
import logger from './logger'

const sequelize = new Sequelize(process.env.DB_URI ?? '', {
  logging: (msg) => logger.debug(msg)
})

const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate()
    logger.info('Postgres database Connection has been established successfully.')
  } catch (error) {
    logger.fatal({
      message: 'Unable to connect to the database',
      error: error
    })
  }
}

export { connectDatabase, sequelize }
