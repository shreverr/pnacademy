import path from 'path'
import fs from 'fs'
import pino from 'pino'

const logsFolderPath = path.join(__dirname, '../logs')

// Check if the logs folder exists, if not, create it
if (!fs.existsSync(logsFolderPath)) {
  fs.mkdirSync(logsFolderPath)
}

// Configure the pino transport
const transport = {
  targets: [
    {
      target: 'pino/file',
      level: 'trace',
      options: { destination: path.join(logsFolderPath, 'app.log') }
    },
    {
      level: 'trace',
      target: 'pino-pretty', // Pretty logs to the console
    }
  ]
}

// Create and export the logger
export default pino({
  level: process.env.PINO_LOG_LEVEL ?? 'info',
  transport
})
