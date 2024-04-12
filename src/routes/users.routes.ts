import { Router } from 'express'

import { wrapRequestHandler } from '@/utils/handlers'
import {
  accessTokenValidator,
  refreshTokenValidator,
  registerValidator,
  verifyEmailValidator,
  loginValidator,
  forgotPasswordValidator,
  verifyForgotPasswordValidator,
} from '@/middlewares/users.middlewares'
import {
  registerController,
  verifyEmailController,
  loginController,
  logoutController,
  resendEmailVerifyController,
  forgotPasswordController,
  verifyForgotPasswordController,
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
 *   operationId: register
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
 * /users/verify-email:
 *  post:
 *   tags:
 *   - users
 *   summary: Verify email of a user
 *   description: Verify email of a user having email verify token
 *   operationId: verify-email
 *   requestBody:
 *    description: Email verify token
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/VerifyEmailReqBody'
 *   responses:
 *    '200':
 *     description: Email verify success
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Email verify success
 *    '401':
 *     description: Unauthorized
 */
usersRouter.post('/verify-email', verifyEmailValidator, wrapRequestHandler(verifyEmailController))

/**
 * @swagger
 * /users/resend-email-verify:
 *  post:
 *   tags:
 *   - users
 *   summary: Resend email verify token
 *   description: Resend email verify token of a user
 *   operationId: resend-email-verify
 *   security:
 *   - bearerAuth: []
 *   responses:
 *    '200':
 *     description: Resend email verify success
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Resend email verify success
 *    '401':
 *     description: Unauthorized
 *    '429':
 *     description: Too many requests
 */
usersRouter.post('/resend-email-verify', accessTokenValidator, wrapRequestHandler(resendEmailVerifyController))

/**
 * @swagger
 * /users/login:
 *  post:
 *   tags:
 *   - users
 *   summary: Login a user
 *   description: Login a user having email and password
 *   operationId: login
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
 *   operationId: logout
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

/**
 * @swagger
 * /users/forgot-password:
 *  post:
 *   tags:
 *   - users
 *   summary: Send email with forgot password token
 *   description: Send email with forgot password token to a user having email
 *   operationId: forgot-password
 *   requestBody:
 *    description: Email
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/ForgotPasswordReqBody'
 *   responses:
 *    '200':
 *     description: Check email to reset password
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Check email to reset password
 *    '401':
 *     description: Unauthorized
 *    '422':
 *     description: Invalid value or missing field
 *    '429':
 *     description: Too many requests
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/**
 * @swagger
 * /users/verify-forgot-password:
 *  post:
 *   tags:
 *   - users
 *   summary: Verify forgot password token
 *   description: Verify forgot password token of a user having forgot password token
 *   operationId: verify-forgot-password
 *   requestBody:
 *    description: Forgot password token
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/VerifyForgotPasswordReqBody'
 *   responses:
 *    '200':
 *     description: Verify forgot password success
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Verify forgot password success
 *    '401':
 *     description: Unauthorized
 */
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordValidator,
  wrapRequestHandler(verifyForgotPasswordController)
)

export default usersRouter
