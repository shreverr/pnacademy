import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
import logger from './logger'

dotenv.config()

const sequelize = new Sequelize(process.env.DB_URI ?? '', {
  logging:  msg => logger.debug(msg),
})

const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

export { connectDatabase, sequelize }
