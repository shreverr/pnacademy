import express from 'express'
import type { Router } from 'express'
import { createTest, findTests } from '../controller/testController'
// import { deleteUser, findAllUsers, findOneUser, loginUser, registerUser, updateUserInfo } from '../controller/userController'
// import { validateDeleteUser, validateFindOneUser, validateRegisterUser, validateUpdateUserInfo, validatefindAllUsers } from '../middleware/Validator'

const router: Router = express.Router()

router.post('/create-test', createTest)
// router.post('/update-userinfo', validateUpdateUserInfo, updateUserInfo)
router.get('/find-tests', findTests)
// router.get('/find-all-users', validatefindAllUsers, findAllUsers)
// router.delete('/delete-user', validateDeleteUser, deleteUser)
// router.post('/login', loginUser)
export default router
