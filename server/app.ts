import express from 'express'
import 'dotenv/config'
import pinoHttp from 'pino-http'
import logger from './config/logger'
import router from './routes'
import User from './model/user/User'
import Tests from './model/tests/Test'
import Questions from './model/tests/Questions'
import options from './model/tests/Options'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(pinoHttp({ logger }))
app.use('/', router)


require('./model/user/User')
require('./model/user/RefreshToken')
require('./model/user/Password')
require('./model/tests/Test')
require('./model/tests/Questions')
require('./model/tests/Options')

// User.hasMany(Tests);
// Tests.belongsTo(User);

// Tests.hasMany(Questions);
// Questions.belongsTo(Tests);

// Questions.hasMany(options);
// options.belongsTo(Questions);

Tests.hasMany(Questions, { foreignKey: 'testId' });
Questions.belongsTo(Tests, { foreignKey: 'testId' });

Questions.hasMany(options, { foreignKey: 'questionId' });
options.belongsTo(Questions, { foreignKey: 'questionId' });

app.get('/', (req, res) => {
  req.log.debug('Hello, worldd!')
  return res.send('Hello, world!')
})

export default app
