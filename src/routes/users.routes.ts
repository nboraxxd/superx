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
  resetPasswordValidator,
  verifiedUserValidator,
  updateMeValidator,
  getProfileValidator,
} from '@/middlewares/users.middlewares'
import {
  registerController,
  verifyEmailController,
  loginController,
  logoutController,
  resendEmailVerifyController,
  forgotPasswordController,
  verifyForgotPasswordController,
  resetPasswordController,
  getMeController,
  updateMeController,
  getProfileController,
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

/**
 * @swagger
 * /users/reset-password:
 *  post:
 *   tags:
 *   - users
 *   summary: Reset password of a user
 *   description: Reset password of a user having forgot password token, password and confirm password
 *   operationId: reset-password
 *   requestBody:
 *    description: Forgot password token, password and confirm password
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/ResetPasswordReqBody'
 *   responses:
 *    '200':
 *     description: Reset password success
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Reset password success
 *         result:
 *          $ref: '#/components/schemas/SuccessAuthentication'
 *    '422':
 *     description: Invalid value or missing field
 */
usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

/**
 * @swagger
 * /users/me:
 *  get:
 *   tags:
 *   - users
 *   summary: Get my profile
 *   description: Get my profile having access token
 *   operationId: get-me
 *   security:
 *   - bearerAuth: []
 *   responses:
 *    '200':
 *     description: Get my profile success
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Get my profile success
 *         result:
 *          $ref: '#/components/schemas/SuccessGetMe'
 *    '401':
 *     description: Unauthorized
 */
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

/**
 * @swagger
 * /users/me:
 *  patch:
 *   tags:
 *   - users
 *   summary: Update my profile
 *   description: Update my profile having access token and user information
 *   operationId: update-me
 *   security:
 *   - bearerAuth: []
 *   requestBody:
 *    description: User information
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/UpdateMeReqBody'
 *   responses:
 *    '200':
 *     description: Update my profile success
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Update my profile success
 *         result:
 *          $ref: '#/components/schemas/SuccessGetMe'
 *    '401':
 *     description: Unauthorized
 *    '422':
 *     description: Invalid value or missing field
 */
usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMeValidator,
  wrapRequestHandler(updateMeController)
)

/**
 * @swagger
 * /users/{username}:
 *  get:
 *   tags:
 *   - users
 *   summary: Get user info
 *   description: Get user info by username
 *   operationId: get-user-profile
 *   parameters:
 *    - in: path
 *      name: username
 *      required: true
 *      description: The username that needs to be fetched. Use `bruce_wayne` for testing.
 *      schema:
 *       type: string
 *       example: bruce_wayne
 *   responses:
 *    '200':
 *     description: Get user profile success
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Get user profile success
 *         result:
 *          $ref: '#/components/schemas/SuccessGetUserProfile'
 *    '404':
 *     description: User not found
 *    '422':
 *     description: Invalid value or missing field
 */
usersRouter.get('/:username', getProfileValidator, wrapRequestHandler(getProfileController))

export default usersRouter
