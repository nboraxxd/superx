import { Request } from 'express'
import { HttpStatusCode } from 'axios'
import { JsonWebTokenError } from 'jsonwebtoken'
import { ParamSchema, checkSchema } from 'express-validator'

import envConfig from '@/config'
import databaseService from '@/services/database.services'
import { validate } from '@/utils/validation'
import { hashPassword } from '@/utils/crypto'
import { verifyToken } from '@/utils/jwt'
import { capitalizeFirstLetter } from '@/utils/common'
import { ErrorWithStatusAndPath } from '@/models/Errors'
import {
  AUTHENTICATION_MESSAGES,
  DATE_MESSAGES,
  EMAIL_MESSAGES,
  NAME_MESSAGES,
  PASSWORD_MESSAGES,
  USER_MESSAGES,
} from '@/constants/message'

const nameSchema: ParamSchema = {
  trim: true,
  notEmpty: { errorMessage: NAME_MESSAGES.REQUIRED },
  isString: { errorMessage: NAME_MESSAGES.STRING },
  isLength: { options: { min: 1, max: 100 }, errorMessage: NAME_MESSAGES.LENGTH },
}

const baseEmailSchema: ParamSchema = {
  trim: true,
  notEmpty: { errorMessage: EMAIL_MESSAGES.REQUIRED },
  isEmail: { errorMessage: EMAIL_MESSAGES.INVALID },
}

const dateOfBirthSchema: ParamSchema = {
  trim: true,
  notEmpty: { errorMessage: DATE_MESSAGES.REQUIRED },
  isISO8601: {
    options: {
      strict: true,
      strictSeparator: true,
    },
    errorMessage: DATE_MESSAGES.ISO8601,
  },
}

const passwordSchema: ParamSchema = {
  trim: true,
  notEmpty: { errorMessage: PASSWORD_MESSAGES.REQUIRED },
  isString: { errorMessage: PASSWORD_MESSAGES.STRING },
  isLength: { options: { min: 6, max: 50 }, errorMessage: PASSWORD_MESSAGES.LENGTH },
  isStrongPassword: {
    options: {
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    errorMessage: PASSWORD_MESSAGES.STRONG,
  },
}

const confirmPasswordSchema: ParamSchema = {
  trim: true,
  notEmpty: { errorMessage: PASSWORD_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED },
  isString: { errorMessage: PASSWORD_MESSAGES.CONFIRM_PASSWORD_IS_STRING },
  isLength: { options: { min: 6, max: 50 }, errorMessage: PASSWORD_MESSAGES.LENGTH_OF_CONFIRM_PASSWORD },
  isStrongPassword: {
    options: {
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    errorMessage: PASSWORD_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRONG,
  },
  custom: {
    options: (value: string, { req }) => {
      if (value !== req.body.password) {
        throw new Error(PASSWORD_MESSAGES.CONFIRM_PASSWORD_THE_SAME_AS_PASSWORD)
      }

      return true
    },
  },
}

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        custom: {
          options: async (value: string, { req, path }) => {
            // Không nên dùng value.replace('Bearer ', '') vì nếu value không chứa 'Bearer ' thì vẫn nhận được value ban đầu
            const access_token = (value || '').split('Bearer ')[1]

            if (!access_token) {
              throw new ErrorWithStatusAndPath({
                message: AUTHENTICATION_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
                status_code: HttpStatusCode.Unauthorized,
                path,
              })
            }

            try {
              const decoded_authorization = await verifyToken({
                token: access_token,
                secretOrPublicKey: envConfig.JWT_SECRET_ACCESS_TOKEN,
              })

              ;(req as Request).decoded_authorization = decoded_authorization
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatusAndPath({
                  message: capitalizeFirstLetter(error.message),
                  status_code: HttpStatusCode.Unauthorized,
                  path,
                })
              } else {
                throw error
              }
            }
          },
        },
      },
    },
    ['headers']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        custom: {
          options: async (value: string, { req, path }) => {
            if (!value) {
              throw new ErrorWithStatusAndPath({
                message: AUTHENTICATION_MESSAGES.REFRESH_TOKEN_IS_REQUIRED,
                status_code: HttpStatusCode.Unauthorized,
                path,
              })
            }

            try {
              const [decoded_refresh_token, refresh_token] = await Promise.all([
                verifyToken({
                  token: value,
                  secretOrPublicKey: envConfig.JWT_SECRET_REFRESH_TOKEN,
                }),
                databaseService.refreshTokens.findOne({ token: value }),
              ])

              if (!refresh_token) {
                throw new ErrorWithStatusAndPath({
                  message: AUTHENTICATION_MESSAGES.REFRESH_TOKEN_USED_OR_NOT_EXIST,
                  status_code: HttpStatusCode.Unauthorized,
                  path,
                })
              }

              ;(req as Request).decoded_refresh_token = decoded_refresh_token
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatusAndPath({
                  message: capitalizeFirstLetter(error.message),
                  status_code: HttpStatusCode.Unauthorized,
                  path,
                })
              } else {
                throw error
              }
            }

            return true
          },
        },
      },
    },
    ['body']
  )
)

export const registerValidator = validate(
  checkSchema(
    {
      name: nameSchema,
      email: {
        ...baseEmailSchema,
        custom: {
          options: async (value: string) => {
            const user = await databaseService.users.findOne({ email: value })

            if (user) {
              throw new Error(EMAIL_MESSAGES.ALREADY_EXISTS)
            }

            return true
          },
        },
      },
      date_of_birth: dateOfBirthSchema,
      password: passwordSchema,
      confirm_password: confirmPasswordSchema,
    },
    ['body']
  )
)

export const verifyEmailValidator = validate(
  checkSchema(
    {
      email_verify_token: {
        trim: true,
        custom: {
          options: async (value: string, { req, path }) => {
            if (!value) {
              throw new ErrorWithStatusAndPath({
                message: AUTHENTICATION_MESSAGES.EMAIL_VERIFY_TOKEN_IS_REQUIRED,
                status_code: HttpStatusCode.Unauthorized,
                path,
              })
            }

            try {
              const decoded_email_verify_token = await verifyToken({
                token: value,
                secretOrPublicKey: envConfig.JWT_SECRET_EMAIL_VERIFY_TOKEN,
              })

              ;(req as Request).decoded_email_verify_token = decoded_email_verify_token
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatusAndPath({
                  message: capitalizeFirstLetter(error.message),
                  status_code: HttpStatusCode.Unauthorized,
                  path,
                })
              } else {
                throw error
              }
            }

            return true
          },
        },
      },
    },
    ['body']
  )
)

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        ...baseEmailSchema,
        custom: {
          options: async (value: string, { req }) => {
            const user = await databaseService.users.findOne({
              email: value,
              password: hashPassword(req.body.password),
            })

            if (!user) {
              throw new Error(AUTHENTICATION_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT)
            }

            req.user = user
            return true
          },
        },
      },
      password: passwordSchema,
    },
    ['body']
  )
)

export const forgotPasswordValidator = validate(
  checkSchema(
    {
      email: {
        ...baseEmailSchema,
        custom: {
          options: async (value: string, { req }) => {
            const user = await databaseService.users.findOne({ email: value })

            if (!user) {
              throw new Error(USER_MESSAGES.NOT_FOUND)
            }

            req.user = user
            return true
          },
        },
      },
    },
    ['body']
  )
)

export const verifyForgotPasswordValidator = validate(
  checkSchema(
    {
      forgot_password_token: {
        trim: true,
        custom: {
          options: async (value: string, { req, path }) => {
            if (!value) {
              throw new ErrorWithStatusAndPath({
                message: AUTHENTICATION_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED,
                status_code: HttpStatusCode.Unauthorized,
                path,
              })
            }

            try {
              const decoded_forgot_password_token = await verifyToken({
                token: value,
                secretOrPublicKey: envConfig.JWT_SECRET_FORGOT_PASSWORD_TOKEN,
              })

              ;(req as Request).decoded_forgot_password_token = decoded_forgot_password_token
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatusAndPath({
                  message: capitalizeFirstLetter(error.message),
                  status_code: HttpStatusCode.Unauthorized,
                  path,
                })
              } else {
                throw error
              }
            }

            return true
          },
        },
      },
    },
    ['body']
  )
)
