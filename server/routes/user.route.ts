import express from 'express'
import type { Router } from 'express'
import { registerUserController } from '../controller/user/user.controller'
import { validateUserLogin, validateUserRegister } from '../lib/validator'
import { validateRequest } from '../utils/validateRequest'

const router: Router = express.Router()

/**
 * @openapi
 * /v1/user/register:
 *   post:
 *     tags:
 *       - User Controller
 *     summary: Create a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               roleId:
 *                 type: string
 *     responses:
 *       '201':
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the success of user creation.
 *                 data:
 *                   type: object
 *                   description: The created user object.
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The ID of the created user.
 *                     first_name:
 *                       type: string
 *                       description: The first name of the created user.
 *                     last_name:
 *                       type: string
 *                       description: The last name of the created user.
 *                     email:
 *                       type: string
 *                       description: The email address of the created user.
 *                     phone:
 *                       type: string
 *                       description: The phone number of the created user.
 *                     role_id:
 *                       type: string
 *                       description: The role ID of the created user (if applicable).
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The timestamp when the user was last updated.
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The timestamp when the user was created.
 *             example:
 *               message: User registered successfully
 *               data:
 *                 id: "81d0198a-9872-4f73-8ae6-c8e6ee3aaa98"
 *                 first_name: jhon
 *                 last_name: doe
 *                 email: asd@duck.com
 *                 phone: null
 *                 role_id: null
 *                 updatedAt: "2024-04-13T09:13:59.470Z"
 *                 createdAt: "2024-04-13T09:13:59.470Z"
 *       409:
 *         description: Conflict
 *       500:
 *         description: Server Error
 */
router.post('/register', validateUserRegister, validateRequest, registerUserController)
router.post('/login', validateUserLogin)

export default router
