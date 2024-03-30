import { Router } from 'express'
import userRouter from './userRouter'
// import attendanceRouter from './attendanceRouter'
// import companyRouter from './companyRouter'

const router: Router = Router()

router.use('/user', userRouter)
// router.use('/attendance', attendanceRouter)
// router.use('/company', companyRouter)

export default router