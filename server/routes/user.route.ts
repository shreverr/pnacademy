import express from "express";
import type { Router } from "express";
import {
  registerUserController,
  UpdateUserController,
} from "../controller/user/user.controller";
import {
  validateUserLogin,
  validateUserRegister,
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
);

export default router;
