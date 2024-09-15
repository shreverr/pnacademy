import express from "express";
import type { Router } from "express";
import {
  createRoleController,
  deleteRoleController,
  deleteUserController,
  exportUserController,
  getUsersByGroupController,
  importUserController,
  loginUserController,
  newAccessTokenController,
  registerUserController,
  removeUsersFromGroupController,
  updateRoleController,
  UpdateUserController,
  UserAddToGroupController,
  viewAllRolesController,
  viewAllUsersController,
  viewUserDetailsController,
  viewUsersByRoleIdController,
} from "../controller/user/user.controller";
import {
  validateGetAllRoles,
  validateGetAllUsers,
  validateGetUsersByGroup,
  validateNewAccessToken,
  validateRemoveUserFromGroup,
  validateUserAddToGroup,
  validateUserDelete,
  validateUserLogin,
  validateUserRegister,
  validateUserRole,
  validateUserRoleDelete,
  validateUserRoleUpdate,
  validateUsersImport,
  validateUserUpdate,
} from "../lib/validator/index";
import { validateRequest } from "../utils/validateRequest";
import { authenticateUser } from "../middleware/Auth";
import { upload } from "../middleware/multer";
import { validateGetUsersByRoleId } from "../lib/validator/user/validator";

const router: Router = express.Router();

/**
 * @swagger
 * /v1/user/info:
 *   get:
 *     summary: Get your user information (JWT auth header necessary)
 *     tags:
 *     - User view Controller
 *     responses:
 *       '200':
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the success of retrieving user info.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique identifier of the user.
 *                     role_id:
 *                       type: string
 *                       description: The role ID of the user.
 *                     first_name:
 *                       type: string
 *                       description: The first name of the user.
 *                     last_name:
 *                       type: string
 *                       description: The last name of the user.
 *                     email:
 *                       type: string
 *                       description: The email address of the user.
 *                     phone:
 *                       type: string
 *                       description: The phone number of the user.
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The timestamp of when the user was created.
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The timestamp of when the user was last updated.
 *             example:
 *               message: success
 *               data:
 *                 id: "ca39d670-225b-422b-8ce4-1bea3993efe8"
 *                 role_id: "fc4c79ed-134e-4539-8e50-b6c6084e357b"
 *                 first_name: "shre"
 *                 last_name: "ver"
 *                 email: "johndoe@mail.com"
 *                 phone: "1234567890"
 *                 createdAt: "2024-05-15T08:59:00.124Z"
 *                 updatedAt: "2024-05-15T08:59:00.124Z"
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Server Error
 */
router.get("/info", authenticateUser(), viewUserDetailsController);

/**
 * @swagger
 * /v1/user/bulk:
 *   get:
 *     summary: Get bulk user information
 *     tags:
 *     - User view Controller
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number for pagination.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of items per page for pagination.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [id, role_id, first_name, last_name, email, phone, createdAt, updatedAt]
 *         required: false
 *         description: Field to sort by.
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         required: false
 *         description: Sort order (ASC or DESC).
 *     responses:
 *       '200':
 *         description: Bulk user information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the success of retrieving bulk user info.
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: The unique identifier of the user.
 *                           role_id:
 *                             type: string
 *                             description: The role ID of the user.
 *                           first_name:
 *                             type: string
 *                             description: The first name of the user.
 *                           last_name:
 *                             type: string
 *                             description: The last name of the user.
 *                           email:
 *                             type: string
 *                             description: The email address of the user.
 *                           phone:
 *                             type: string
 *                             description: The phone number of the user.
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: The timestamp of when the user was created.
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             description: The timestamp of when the user was last updated.
 *                     totalPages:
 *                       type: integer
 *                       description: The total number of pages for pagination.
 *             example:
 *               message: success
 *               data:
 *                 users:
 *                   - id: "31620378-8396-42c9-a73d-9e75cabcbea0"
 *                     role_id: "fc4c79ed-134e-4539-8e50-b6c6084e357b"
 *                     first_name: "shre"
 *                     last_name: "ver"
 *                     email: "johndoe1@mail.com"
 *                     phone: "1234567890"
 *                     createdAt: "2024-05-15T18:20:01.818Z"
 *                     updatedAt: "2024-05-15T18:20:01.818Z"
 *                   - id: "9845b3d0-189c-4109-b7cf-0a3ee1ba387c"
 *                     role_id: "fc4c79ed-134e-4539-8e50-b6c6084e357b"
 *                     first_name: "shre"
 *                     last_name: "ver"
 *                     email: "johndoe5@mail.com"
 *                     phone: "1234567890"
 *                     createdAt: "2024-05-15T18:20:01.830Z"
 *                     updatedAt: "2024-05-15T18:20:01.830Z"
 *                   - id: "b9d9cf9a-c19a-435c-8d7b-283956c2445f"
 *                     role_id: "fc4c79ed-134e-4539-8e50-b6c6084e357b"
 *                     first_name: "shre"
 *                     last_name: "ver"
 *                     email: "johndoe4@mail.com"
 *                     phone: "1234567890"
 *                     createdAt: "2024-05-15T18:20:01.841Z"
 *                     updatedAt: "2024-05-15T18:20:01.841Z"
 *                   - id: "0d50e6f1-dd66-4fc1-84ee-98b2067acc0b"
 *                     role_id: "fc4c79ed-134e-4539-8e50-b6c6084e357b"
 *                     first_name: "shre"
 *                     last_name: "ver"
 *                     email: "johndoe3@mail.com"
 *                     phone: "1234567890"
 *                     createdAt: "2024-05-15T18:20:01.844Z"
 *                     updatedAt: "2024-05-15T18:20:01.844Z"
 *                 totalPages: 3
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Server Error
 */
router.get(
  "/bulk",
  authenticateUser(["canManageUser"]),
  validateGetAllUsers,
  validateRequest,
  viewAllUsersController
);

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
  authenticateUser(["canManageUser"]),
  validateUserRegister,
  validateRequest,
  registerUserController
);

/**
 * @openapi
 * /v1/user/update:
 *   patch:
 *     tags:
 *       - User update Controller
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
 *                   roleId:
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
 *                     roleId:
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
router.patch(
  "/update",
  authenticateUser(["canManageUser"]),
  validateUserUpdate,
  validateRequest,
  UpdateUserController
);

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
 *               - deviceType
 *             properties:
 *               email:
 *                 type: string
 *               deviceType:
 *                 type: mobile | web
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
router.post("/login", validateUserLogin, validateRequest, loginUserController);

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
 *                   - canManageReports
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
 *                   canManageReports:
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
 *                         canManageReports:
 *                           type: boolean
 *                           description: Whether the role can manage reports.
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
 *                 id: "string"
 *                 name: admin
 *                 permissions:
 *                   canManageAssessment: true
 *                   canManageUser: true
 *                   canManageRole: true
 *                   canManageNotification: true
 *                   canManageLocalGroup: true
 *                   canManageReports: true
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
  authenticateUser(["canManageRole"]),
  validateUserRole,
  validateRequest,
  createRoleController
);

/**
 * @swagger
 * /v1/user/role:
 *   patch:
 *     summary: Update a user role
 *     tags:
 *       - User update Controller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleId
 *             properties:
 *               roleId:
 *                 type: string
 *                 format: uuid
 *                 description: The unique identifier of the role (UUID v4)
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 description: The name of the role (optional)
 *               permissions:
 *                 type: object
 *                 properties:
 *                   canManageAssessment:
 *                     type: boolean
 *                     description: Permission to manage assessments
 *                   canManageRole:
 *                     type: boolean
 *                     description: Permission to manage roles
 *                   canManageNotification:
 *                     type: boolean
 *                     description: Permission to manage notifications
 *                   canManageLocalGroup:
 *                     type: boolean
 *                     description: Permission to manage local groups
 *                   canManageReports:
 *                     type: boolean
 *                     description: Permission to manage reports
 *                   canAttemptAssessment:
 *                     type: boolean
 *                     description: Permission to attempt assessments
 *                   canViewReport:
 *                     type: boolean
 *                     description: Permission to view reports
 *                   canManageMyAccount:
 *                     type: boolean
 *                     description: Permission to manage own account
 *                   canViewNotification:
 *                     type: boolean
 *                     description: Permission to view notifications
 *     responses:
 *       201:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Role Updated successfully
 *                 data:
 *                   type: object
 *                   description: The updated role object
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *                       location:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.patch(
  "/role",
  authenticateUser(["canManageRole"]),
  validateUserRoleUpdate,
  validateRequest,
  updateRoleController
);

/**
 * @swagger
 * /v1/user/roles:
 *   get:
 *     summary: Get roles information
 *     tags:
 *     - User view Controller
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number for pagination.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of items per page for pagination.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [id, name, canManageAssessment, canManageUser, canManageRole, canManageNotification, canManageLocalGroup, canManageReports, canAttemptAssessment, canViewReport, canManageMyAccount, canViewNotification, createdAt, updatedAt, role_id]
 *         required: false
 *         description: Field to sort by.
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         required: false
 *         description: Sort order (ASC or DESC).
 *     responses:
 *       '200':
 *         description: Roles information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the success of retrieving roles information.
 *                 data:
 *                   type: object
 *                   properties:
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: The unique identifier of the role.
 *                           name:
 *                             type: string
 *                             description: The name of the role.
 *                           canManageAssessment:
 *                             type: boolean
 *                             description: Whether the role can manage assessments.
 *                           canManageUser:
 *                             type: boolean
 *                             description: Whether the role can manage users.
 *                           canManageRole:
 *                             type: boolean
 *                             description: Whether the role can manage roles.
 *                           canManageNotification:
 *                             type: boolean
 *                             description: Whether the role can manage notifications.
 *                           canManageLocalGroup:
 *                             type: boolean
 *                             description: Whether the role can manage local groups.
 *                           canManageReports:
 *                             type: boolean
 *                             description: Whether the role can manage reports.
 *                           canAttemptAssessment:
 *                             type: boolean
 *                             description: Whether the role can attempt assessments.
 *                           canViewReport:
 *                             type: boolean
 *                             description: Whether the role can view reports.
 *                           canManageMyAccount:
 *                             type: boolean
 *                             description: Whether the role can manage its own account.
 *                           canViewNotification:
 *                             type: boolean
 *                             description: Whether the role can view notifications.
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: The timestamp of when the role was created.
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             description: The timestamp of when the role was last updated.
 *                           role_id:
 *                             type: string
 *                             description: The ID of the role.
 *                     totalPages:
 *                       type: integer
 *                       description: The total number of pages for pagination.
 *             example:
 *               message: success
 *               data:
 *                 roles:
 *                   - id: "e0e76f1c-f167-4d78-a7d9-4dd7dd548f11"
 *                     name: "admin"
 *                     canManageAssessment: true
 *                     canManageUser: true
 *                     canManageRole: true
 *                     canManageNotification: true
 *                     canManageLocalGroup: true
 *                     canManageReports: true
 *                     canAttemptAssessment: true
 *                     canViewReport: true
 *                     canManageMyAccount: true
 *                     canViewNotification: true
 *                     createdAt: "2024-05-16T04:49:04.668Z"
 *                     updatedAt: "2024-05-16T04:49:04.668Z"
 *                     role_id: null
 *                   - id: "7fe5fe98-fa73-457c-aea5-7fad527c58e7"
 *                     name: "admin"
 *                     canManageAssessment: true
 *                     canManageUser: true
 *                     canManageRole: true
 *                     canManageNotification: true
 *                     canManageLocalGroup: true
 *                     canManageReports: true
 *                     canAttemptAssessment: true
 *                     canViewReport: true
 *                     canManageMyAccount: true
 *                     canViewNotification: true
 *                     createdAt: "2024-05-16T04:49:10.715Z"
 *                     updatedAt: "2024-05-16T04:49:10.715Z"
 *                     role_id: null
 *                   - id: "88fec24f-520c-4430-8d9e-79522c41d1af"
 *                     name: "admin"
 *                     canManageAssessment: true
 *                     canManageUser: true
 *                     canManageRole: true
 *                     canManageNotification: true
 *                     canManageLocalGroup: true
 *                     canManageReports: true
 *                     canAttemptAssessment: true
 *                     canViewReport: true
 *                     canManageMyAccount: true
 *                     canViewNotification: true
 *                     createdAt: "2024-05-16T04:49:28.535Z"
 *                     updatedAt: "2024-05-16T04:49:28.535Z"
 *                     role_id: null
 *                   - id: "14568cdb-17a8-4b4e-bddd-66ea0be635ec"
 *                     name: "admin"
 *                     canManageAssessment: true
 *                     canManageUser: true
 *                     canManageRole: true
 *                     canManageNotification: true
 *                     canManageLocalGroup: true
 *                     canManageReports: true
 *                     canAttemptAssessment: true
 *                     canViewReport: true
 *                     canManageMyAccount: true
 *                     canViewNotification: true
 *                     createdAt: "2024-05-16T04:49:29.453Z"
 *                     updatedAt: "2024-05-16T04:49:29.453Z"
 *                     role_id: null
 *                 totalPages: 4
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Server Error
 */
router.get(
  "/roles",
  authenticateUser(["canManageRole"]),
  validateGetAllRoles,
  validateRequest,
  viewAllRolesController
);

/**
 * @swagger
 * /v1/user/role:
 *   get:
 *     summary: Get users by role ID
 *     tags:
 *     - User view Controller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: roleId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: UUID v4 of the role to fetch users for.
 *     responses:
 *       '200':
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         description: The unique identifier of the user.
 *                       username:
 *                         type: string
 *                         description: The username of the user.
 *                       email:
 *                         type: string
 *                         format: email
 *                         description: The email address of the user.
 *                       roleId:
 *                         type: string
 *                         format: uuid
 *                         description: The ID of the user's role.
 *             example:
 *               status: success
 *               data:
 *                 - id: "123e4567-e89b-12d3-a456-426614174000"
 *                   username: "johndoe"
 *                   email: "john.doe@example.com"
 *                   roleId: "98765432-e89b-12d3-a456-426614174000"
 *                 - id: "987e6543-e89b-12d3-a456-426614174001"
 *                   username: "janedoe"
 *                   email: "jane.doe@example.com"
 *                   roleId: "98765432-e89b-12d3-a456-426614174000"
 *       '400':
 *         description: Bad Request - Invalid roleId
 *       '401':
 *         description: Unauthorized - User doesn't have the required permissions
 *       '500':
 *         description: Internal Server Error
 */

router.get(
  "/role",
  authenticateUser(["canManageRole"]),
  validateGetUsersByRoleId,
  validateRequest,  
  viewUsersByRoleIdController
)

/**
 * @openapi
 * /v1/user/role:
 *   delete:
 *     tags:
 *       - User Delete Controller
 *     summary: Delete a user role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleIds:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     roleId:
 *                       type: string
 *                       description: The ID of the role to delete.
 *             required:
 *               - roleIds
 *     responses:
 *       '200':
 *         description: Role deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the success of role deletion.
 *                   example: Role deleted successfully
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Role not found
 *       '409':
 *         description: Conflict
 *       '500':
 *         description: Server Error
 *       '405':
 *         description: Method Not Allowed
 *       '406':
 *         description: Not Acceptable
 *       '408':
 *         description: Request Timeout
 */
router.delete(
  "/role",
  authenticateUser(["canManageRole"]),
  validateUserRoleDelete,
  validateRequest,
  deleteRoleController
);

/**
 * @swagger
 * /v1/user/access-token:
 *   post:
 *     summary: Get new access token using refresh token
 *     tags: [User Controller]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the success of access token generation.
 *                 accessToken:
 *                   type: string
 *                   description: Access token for authenticated user.
 *             example:
 *               message: New Access Token granted successfully
 *               accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *       '500':
 *         description: Server Error
 */
router.post(
  "/access-token",
  validateNewAccessToken,
  validateRequest,
  newAccessTokenController
);

/**
 * @swagger
 * /v1/user/import:
 *   post:
 *     summary: Import users from a CSV file
 *     description: This endpoint allows for importing users from a CSV file. It also provides an option to update existing users.
 *     tags: [User Controller]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: users
 *         type: file
 *         required: true
 *         description: The CSV file containing the users to import.
 *       - in: formData
 *         name: updateExisting
 *         type: boolean
 *         required: true
 *         description: Flag indicating whether to update existing users.
 *     responses:
 *       200:
 *         description: Users imported successfully.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: success
 *       400:
 *         description: Bad request, possibly due to invalid file format or missing parameters.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Bad request. Invalid file format or missing parameters.
 *       500:
 *         description: Internal server error.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Internal server error.
 */
router.post(
  "/import",
  authenticateUser(["canManageUser"]),
  upload.single("users"),
  validateUsersImport,
  validateRequest,
  importUserController
);

/**
 * @swagger
 * /v1/user/export:
 *   get:
 *     summary: Export user data as a CSV file
 *     tags:
 *      - User view Controller
 *     description: This endpoint allows exporting user data in CSV format. The CSV file will include all user data from the user table.
 *     responses:
 *       '200':
 *         description: Successfully exported user data as a CSV file.
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *             examples:
 *               example-1:
 *                 summary: Example CSV file
 *                 value: |
 *                   id,first_name,last_name,email,phone,createdAt,updatedAt
 *                   b9f49f4f-4790-4edd-a833-a426f301c804,admin,sa,admin@xyz.com,9876543210,2024-07-20T05:35:59.042Z,2024-07-20T05:35:59.042Z
 *                   29d832ef-b488-4d87-8471-f9e1ce7e1841,admin,admin,admin@pna.com,9876543210,2024-07-20T13:46:13.421Z,2024-07-20T13:46:13.421Z
 *                   fb1202ed-9714-4781-abb9-e160ea3f7f4b,Shakti,Dubey,shakti@gmail.com,9898989898,2024-07-20T13:48:44.722Z,2024-07-20T13:48:44.722Z
 *                   3ef2bbe7-54ab-4b30-8c66-84ad5f1cee87,Bhumi,2.0,bhumi@ibn.com,4204204200,2024-07-22T09:10:04.441Z,2024-07-22T09:10:04.441Z
 *       '500':
 *         description: Internal server error occurred while generating the CSV file.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error occurred while generating the CSV file.
 */
router.get(
  "/export",
  authenticateUser(["canManageUser"]),
  exportUserController
);

/**
 * @swagger
 * /v1/user/delete:
 *   delete:
 *     summary: Delete multiple users
 *     tags:
 *      - User Delete Controller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [
 *                   "1f8cd887-8871-49bb-955e-e40dc023ff5f",
 *                   "75131057-326d-4dd6-88bc-172a3aa51f09",
 *                   "cb57be3c-ba47-4a27-b425-0a9b33bb3e68",
 *                   "0b0fcaff-68d3-4a64-a227-9d67d257315c"
 *                 ]
 *     responses:
 *       '200':
 *         description: Users deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message.
 *             example:
 *               message: Users deleted successfully
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Server error
 */
router.delete(
  "/delete",
  authenticateUser(["canManageUser"]),
  validateUserDelete,
  validateRequest,
  deleteUserController
);

/**
 * @swagger
 * /v1/user/add-to-group:
 *   post:
 *     summary: Add users to a group
 *     tags: [User Controller]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 example: ["ca7f9a83-b0d8-41a8-9b4a-1e1ffe9660e2", "ca7f9a83-b0d8-41a8-9b4a-1e1ffe9660e1"]
 *                 description: Array of user IDs to add to the group.
 *               groupId:
 *                 type: string
 *                 format: uuid
 *                 example: "ca7f9a83-b0d8-41a8-9b4a-1e1ffe9660e1"
 *                 description: The ID of the group to which users will be added.
 *             required:
 *               - userIds
 *               - groupId
 *     responses:
 *       '200':
 *         description: Users added to the group successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                   description: Status of the request.
 *                 message:
 *                   type: string
 *                   example: Users added successfully
 *                   description: Message indicating the result of the operation.
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Server Error
 */
router.post(
  "/add-to-group",
  authenticateUser(["canManageUser", "canManageLocalGroup"]),
  validateUserAddToGroup,
  validateRequest,
  UserAddToGroupController
);

/**
 * @swagger
 * /v1/user/remove-from-group:
 *   delete:
 *     summary: Remove users from a group
 *     tags:
 *      - User Delete Controller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: An array of user IDs to be removed from the group.
 *                 required: true
 *               groupId:
 *                 type: string
 *                 description: The ID of the group from which users will be removed.
 *                 required: true
 *     responses:
 *       '200':
 *         description: Users removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the operation (e.g., "success").
 *                 message:
 *                   type: string
 *                   description: A message indicating the outcome of the operation (e.g., "Users removed successfully").
 *       '400':
 *         description: Bad Request - Invalid request body or parameters.
 *       '401':
 *         description: Unauthorized - User is not authorized to perform this action.
 *       '404':
 *         description: Not Found - Group or user(s) not found.
 *       '500':
 *         description: Internal Server Error - Unexpected server error occurred.
 */
router.delete(
  "/remove-from-group",
  authenticateUser(["canManageUser", "canManageLocalGroup"]),
  validateRemoveUserFromGroup,
  validateRequest,
  removeUsersFromGroupController
);

/**
 * @swagger
 * /v1/user/by-group:
 *   get:
 *     summary: Get users by group ID with pagination and sorting.
 *     tags:
 *     - User view Controller
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number for pagination.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of items per page for pagination.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [id, role_id, first_name, last_name, email, phone, createdAt, updatedAt]
 *         required: false
 *         description: Field to sort by.
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         required: false
 *         description: Sort order (ASC or DESC).
 *       - in: query
 *         name: groupId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the group to filter users by.
 *     responses:
 *       '200':
 *         description: Users retrieved successfully by group ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Response status.
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: The unique identifier of the user.
 *                           role_id:
 *                             type: string
 *                             nullable: true
 *                             description: The role ID of the user.
 *                           first_name:
 *                             type: string
 *                             description: The first name of the user.
 *                           last_name:
 *                             type: string
 *                             description: The last name of the user.
 *                           email:
 *                             type: string
 *                             description: The email address of the user.
 *                           phone:
 *                             type: string
 *                             nullable: true
 *                             description: The phone number of the user.
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: The timestamp of when the user was created.
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             description: The timestamp of when the user was last updated.
 *                     totalPages:
 *                       type: integer
 *                       description: The total number of pages for pagination.
 *             example:
 *               status: success
 *               data:
 *                 users:
 *                   - id: "1a77a8e2-6b6a-48f5-9251-c3adfb8c6f24"
 *                     role_id: null
 *                     first_name: "admin"
 *                     last_name: "  "
 *                     email: "din1@pnasss.com"
 *                     phone: "9876543210"
 *                     createdAt: "2024-08-08T13:54:50.447Z"
 *                     updatedAt: "2024-08-08T13:54:50.447Z"
 *                 totalPages: 1
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Server Error
 */
router.get(
  "/by-group",
  authenticateUser(["canManageUser", "canManageLocalGroup"]),
  validateGetUsersByGroup,
  validateRequest,
  getUsersByGroupController
);

export default router;
