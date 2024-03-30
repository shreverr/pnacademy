import express from 'express'
import type { Router } from 'express'
import { deleteUser, findAllUsers, findOneUser, loginUser, registerUser, updateUserInfo } from '../controller/userController'
import { validateDeleteUser, validateFindOneUser, validateRegisterUser, validateUpdateUserInfo, validatefindAllUsers } from '../middleware/Validator'

const router: Router = express.Router()

router.post('/register', validateRegisterUser, registerUser)
router.post('/update-userinfo', validateUpdateUserInfo, updateUserInfo)
router.get('/find-one-user', validateFindOneUser, findOneUser)
router.get('/find-all-users', validatefindAllUsers, findAllUsers)
router.delete('/delete-user', validateDeleteUser, deleteUser)
router.post('/login', loginUser)
// router.post('/new-token', newAccessToken)
router.post('/logout', (req, res) => {
  return res.send('logout')
})

export default router
