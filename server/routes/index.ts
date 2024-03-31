import { Router } from 'express'
import userRouter from './userRouter'
import testRouter from './testRouter'
// import companyRouter from './companyRouter'

const router: Router = Router()

router.use('/user', userRouter)
router.use('/test', testRouter)
// router.use('/company', companyRouter)

export default router