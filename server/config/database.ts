import { Sequelize } from 'sequelize'
import logger from './logger'

const sequelize = new Sequelize(process.env.DB_URI ?? '', {
  logging: (msg) => { logger.info(msg) },
  dialect: "postgres",
  timezone: '+00:00',
  ssl: process.env.ENVIRONMENT === 'prod' ? true : false,
  dialectOptions: process.env.ENVIRONMENT === 'prod' ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
    useUTC: true,
  } : { useUTC: true, }
})

const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate()
    logger.info('Postgres database Connection has been established successfully.')
  } catch (error) {
    logger.fatal({
      message: 'Unable to connect to the database',
      error
    })
  }
}

export { connectDatabase, sequelize }
