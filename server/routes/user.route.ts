import express from "express";
import type { Router } from "express";
import {
  createRoleController,
  loginUserController,
  // loginUserController,
  registerUserController,
  UpdateUserController,
} from "../controller/user/user.controller";
import {
  validateUserLogin,
  validateUserRegister,
  validateUserRole,
  validateUserUpdate,
} from "../lib/validator";
import { validateRequest } from "../utils/validateRequest";

const router: Router = express.Router();

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
 *         application/json:
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
router.post(
  "/register",
  validateUserRegister,
  validateRequest,
  registerUserController
);

/**
 * @openapi
 * /v1/user/update:
 *   post:
 *     tags:
 *       - User Controller
 *     summary: Update a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - dataToUpdate
 *             properties:
 *               id:
 *                 type: string
 *               dataToUpdate:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   role_id:
 *                     type: string
 *     responses:
 *       '200':
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the success of user update.
 *                 data:
 *                   type: object
 *                   description: The updated user object.
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The ID of the updated user.
 *                     firstName:
 *                       type: string
 *                       description: The first name of the updated user.
 *                     lastName:
 *                       type: string
 *                       description: The last name of the updated user.
 *                     email:
 *                       type: string
 *                       description: The email address of the updated user.
 *                     phone:
 *                       type: string
 *                       description: The phone number of the updated user.
 *                     role_id:
 *                       type: string
 *                       description: The role ID of the updated user (if applicable).
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The timestamp when the user was last updated.
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The timestamp when the user was created.
 *             example:
 *               message: User updated successfully
 *               data:
 *                 id: "a4aadb2b-f13b-4bd6-8ed5-6082e5e7c337"
 *                 firstName: John
 *                 lastName: Doe
 *                 email: john.doe@example.com
 *                 phone: "1234567891"
 *                 role_id: "12345"
 *                 updatedAt: "2024-04-13T09:13:59.470Z"
 *                 createdAt: "2024-04-13T09:13:59.470Z"
 *       '409':
 *         description: Conflict
 *       '500':
 *         description: Server Error
 */

router.post(
  "/update",
  validateUserUpdate,
  validateRequest,
  UpdateUserController
)

/**
 * @swagger
 * /v1/user/login:
 *   post:
 *     summary: Login user
 *     tags: [User Controller]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the success of user login.
 *                 accessToken:
 *                   type: string
 *                   description: Access token for authenticated user.
 *                 refreshToken:
 *                   type: string
 *                   description: Refresh token for authenticated user.
 *             example:
 *               message: User logged in successfully
 *               accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *               refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Server Error
 */
router.post(
  '/login',
  validateUserLogin,
  validateRequest,
  loginUserController
)

/**
 * @swagger
 * /v1/user/role:
 *   post:
 *     summary: Create a new user role
 *     tags: [User Controller]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - permissions
 *             properties:
 *               name:
 *                 type: string
 *               permissions:
 *                 type: object
 *                 required:
 *                   - canManageAssessment
 *                   - canManageUser
 *                   - canManageRole
 *                   - canManageNotification
 *                   - canManageLocalGroup
 *                   - canAttemptAssessment
 *                   - canViewReport
 *                   - canManageMyAccount
 *                   - canViewNotification
 *                 properties:
 *                   canManageAssessment:
 *                     type: boolean
 *                   canManageUser:
 *                     type: boolean
 *                   canManageRole:
 *                     type: boolean
 *                   canManageNotification:
 *                     type: boolean
 *                   canManageLocalGroup:
 *                     type: boolean
 *                   canAttemptAssessment:
 *                     type: boolean
 *                   canViewReport:
 *                     type: boolean
 *                   canManageMyAccount:
 *                     type: boolean
 *                   canViewNotification:
 *                     type: boolean
 *     responses:
 *       '201':
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the success of role creation.
 *                 data:
 *                   type: object
 *                   description: The created role object.
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The ID of the created role.
 *                     name:
 *                       type: string
 *                       description: The name of the created role.
 *                     permissions:
 *                       type: object
 *                       description: The permissions associated with the created role.
 *                       properties:
 *                         canManageAssessment:
 *                           type: boolean
 *                           description: Whether the role can manage assessments.
 *                         canManageUser:
 *                           type: boolean
 *                           description: Whether the role can manage users.
 *                         canManageRole:
 *                           type: boolean
 *                           description: Whether the role can manage roles.
 *                         canManageNotification:
 *                           type: boolean
 *                           description: Whether the role can manage notifications.
 *                         canManageLocalGroup:
 *                           type: boolean
 *                           description: Whether the role can manage local groups.
 *                         canAttemptAssessment:
 *                           type: boolean
 *                           description: Whether the role can attempt assessments.
 *                         canViewReport:
 *                           type: boolean
 *                           description: Whether the role can view reports.
 *                         canManageMyAccount:
 *                           type: boolean
 *                           description: Whether the role can manage its own account.
 *                         canViewNotification:
 *                           type: boolean
 *                           description: Whether the role can view notifications.
 *             example:
 *               message: Role created successfully
 *               data:
 *                 id: "81d0198a-9872-4f73-8ae6-c8e6ee3aaa98"
 *                 name: admin
 *                 permissions:
 *                   canManageAssessment: true
 *                   canManageUser: true
 *                   canManageRole: true
 *                   canManageNotification: true
 *                   canManageLocalGroup: true
 *                   canAttemptAssessment: true
 *                   canViewReport: true
 *                   canManageMyAccount: true
 *                   canViewNotification: true
 *       '409':
 *         description: Conflict
 *       '500':
 *         description: Server Error
 */
router.post(
  "/role",
  validateUserRole,
  validateRequest,
  createRoleController
)

export default router;
