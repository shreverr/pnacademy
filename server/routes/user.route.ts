import express from 'express'
import type { Router } from 'express'

const router: Router = express.Router()

router.post('/register', (req, res) => res.send('Register'))

export default router
