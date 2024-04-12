import express from 'express'
import type { Router } from 'express'
import { registerUser } from '../controller/user/user.controller'
import { validateUserRegister } from '../lib/validator'

const router: Router = express.Router()

router.post('/register', validateUserRegister, registerUser)

export default router
