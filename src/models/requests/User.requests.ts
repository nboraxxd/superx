/**
 * @swagger
 * components:
 *  schemas:
 *   RegisterReqBody:
 *    required:
 *    - name
 *    - email
 *    - date_of_birth
 *    - password
 *    - confirm_password
 *    type: object
 *    properties:
 *     name:
 *      type: string
 *      example: Bruce Wayne
 *     email:
 *      type: string
 *      example: bruce@wayne.dc
 *     date_of_birth:
 *      type: string
 *      format: ISO 8601
 *      example: 1970-02-19T08:46:24.000Z
 *     password:
 *      type: string
 *      format: password
 *      example: Abcd12345@#
 *     confirm_password:
 *      type: string
 *      format: password
 *      example: Abcd12345@#
 *
 *   VerifyEmailReqBody:
 *    required:
 *    - email_verify_token
 *    type: object
 *    properties:
 *     email_verify_token:
 *      type: string
 *      example: eyJhbGciOiJIUzI1N...
 *
 *   LoginReqBody:
 *    required:
 *    - email
 *    - password
 *    type: object
 *    properties:
 *     email:
 *      type: string
 *      example: bruce@wayne.dc
 *     password:
 *      type: string
 *      format: password
 *      example: Abcd12345@#
 *
 *   LogoutReqBody:
 *    required:
 *    - refresh_token
 *    type: object
 *    properties:
 *     refresh_token:
 *      type: string
 *      example: eyJhbGciOiJIUzI1N...
 *
 *   ForgotPasswordReqBody:
 *    required:
 *    - email
 *    type: object
 *    properties:
 *     email:
 *      type: string
 *      example: bruce@wayne.dc
 *
 *   VerifyForgotPasswordReqBody:
 *    required:
 *    - forgot_password_token
 *    type: object
 *    properties:
 *     forgot_password_token:
 *      type: string
 *      example: eyJhbGciOiJIUzI1N...
 *
 *   ResetPasswordReqBody:
 *    required:
 *    - forgot_password_token
 *    - password
 *    - confirm_password
 *    type: object
 *    properties:
 *     forgot_password_token:
 *      type: string
 *      example: eyJhbGciOiJIUzI1N...
 *     password:
 *      type: string
 *      format: password
 *      example: Abcd12345@#
 *     confirm_password:
 *      type: string
 *      format: password
 *      example: Abcd12345@#
 *
 *   SuccessAuthentication:
 *    type: object
 *    properties:
 *     access_token:
 *      type: string
 *      example: eyJhbGciOiJIUzI1N...
 *     refresh_token:
 *      type: string
 *      example: eyJhbGciOiJIUzI1N...
 *   SuccessGetMe:
 *    type: object
 *    properties:
 *     _id:
 *      type: string
 *      example: 123abc...
 *     name:
 *      type: string
 *      example: Bruce Wayne
 *     email:
 *      type: string
 *      example: bruce@wayne.dc
 *     date_of_birth:
 *      type: string
 *      format: ISO 8601
 *      example: 1970-02-19T08:46:24.000Z
 *     created_at:
 *      type: string
 *      format: ISO 8601
 *      example: 2021-02-19T08:46:24.000Z
 *     updated_at:
 *      type: string
 *      format: ISO 8601
 *      example: 2021-02-19T08:46:24.000Z
 *     verify:
 *      type: number
 *      enum: [0, 1, 2]
 *      example: 0
 *     tweeter_circle:
 *      type: array
 *      items:
 *       type: string
 *      example: [123abc..., 456def...]
 *     bio:
 *      type: string
 *      example: I'm Batman
 *     location:
 *      type: string
 *      example: Gotham City
 *     website:
 *      type: string
 *      example: https://brucewayne.dc
 *     username:
 *      type: string
 *      example: bruce_wayne
 *     avatar:
 *      type: string
 *      example: https://brucewayne.dc/avatar.jpg
 *     cover_photo:
 *      type: string
 *      example: https://brucewayne.dc/cover.jpg
 */

export type RegisterReqBody = {
  name: string
  email: string
  date_of_birth: string
  password: string
  confirm_password: string
}

export type VerifyEmailReqBody = {
  email_verify_token: string
}

export type LoginReqBody = {
  email: string
  password: string
}

export type LogoutReqBody = {
  refresh_token: string
}

export type ForgotPasswordReqBody = {
  email: string
}

export type VerifyForgotPasswordReqBody = {
  forgot_password_token: string
}

export type ResetPasswordReqBody = {
  forgot_password_token: string
  password: string
  confirm_password: string
}
