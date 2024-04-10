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
 *   SuccessAuthentication:
 *    type: object
 *    properties:
 *     access_token:
 *      type: string
 *      example: eyJhbGciOiJIUzI1N...
 *     refresh_token:
 *      type: string
 *      example: eyJhbGciOiJIUzI1N...
 */

export interface RegisterReqBody {
  name: string
  email: string
  date_of_birth: string
  password: string
  confirm_password: string
}

export interface LoginReqBody {
  email: string
  password: string
}
