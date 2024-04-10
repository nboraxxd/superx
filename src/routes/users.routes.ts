import { Router } from 'express'

import { wrapRequestHandler } from '@/utils/handlers'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
} from '@/middlewares/users.middlewares'
import { loginController, logoutController, registerController } from '@/controllers/users.controllers'

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

usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

export default usersRouter
