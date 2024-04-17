import { Router } from 'express'
import userRouter from './user.route'
import assessmenRouter from './assessment.route'
const router: Router = Router()

router.use('/user', userRouter)
router.use('/assessment', assessmenRouter)

export default router
