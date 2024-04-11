import { Router } from 'express'

import { wrapRequestHandler } from '@/utils/handlers'
import {
  accessTokenValidator,
  refreshTokenValidator,
  registerValidator,
  verifyEmailValidator,
  loginValidator,
} from '@/middlewares/users.middlewares'
import {
  registerController,
  verifyEmailController,
  loginController,
  logoutController,
} from '@/controllers/users.controllers'

const usersRouter = Router()

/**
 * @swagger
 * /users/register:
 *  post:
 *   tags:
 *   - users
 *   summary: Register a new user
 *   description: Create a new user having name, email, date of birth, password and confirm password
 *   operationId: registerUser
 *   requestBody:
 *    description: User information
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/RegisterReqBody'
 *   responses:
 *    '201':
 *     description: Register success
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Register success
 *         result:
 *          $ref: '#/components/schemas/SuccessAuthentication'
 *    '422':
 *     description: Invalid value or missing field
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * @swagger
 * /users/login:
 *  post:
 *   tags:
 *   - users
 *   summary: Login a user
 *   description: Login a user having email and password
 *   operationId: loginUser
 *   requestBody:
 *    description: User information
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/LoginReqBody'
 *   responses:
 *    '200':
 *     description: Login success
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Login success
 *         result:
 *          $ref: '#/components/schemas/SuccessAuthentication'
 *    '422':
 *     description: Invalid value or missing field
 */
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * @swagger
 * /users/logout:
 *  post:
 *   tags:
 *   - users
 *   summary: Logout a user
 *   description: Logout a user having access token and refresh token
 *   operationId: logoutUser
 *   security:
 *   - bearerAuth: []
 *   requestBody:
 *    description: Refresh token
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/LogoutReqBody'
 *   responses:
 *    '200':
 *     description: Logout success
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Logout success
 *    '401':
 *     description: Unauthorized
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

usersRouter.post('/verify-email', verifyEmailValidator, wrapRequestHandler(verifyEmailController))

export default usersRouter
