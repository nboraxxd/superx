import { NextFunction, Request, Response } from 'express'
import { HttpStatusCode } from 'axios'
import { JsonWebTokenError } from 'jsonwebtoken'
import { ParamSchema, checkSchema } from 'express-validator'

import envConfig from '@/config'
import databaseService from '@/services/database.services'
import { validate } from '@/utils/validation'
import { hashPassword } from '@/utils/crypto'
import { verifyToken } from '@/utils/jwt'
import { capitalizeFirstLetter } from '@/utils/common'
import { ErrorWithStatus, ErrorWithStatusAndPath } from '@/models/Errors'
import { TokenPayload } from '@/models/requests/Token.requests'
import { UserVerifyStatus } from '@/constants/enums'
import {
  AUTHENTICATION_MESSAGES,
  BIO_MESSAGES,
  DATE_MESSAGES,
  EMAIL_MESSAGES,
  IMAGE_MESSAGES,
  LOCATION_MESSAGES,
  NAME_MESSAGES,
  PASSWORD_MESSAGES,
  USERNAME_MESSAGES,
  USER_MESSAGES,
  WEBSITE_MESSAGES,
} from '@/constants/message'

// do trim sẽ chuyển giá trị về string type, nên phải check isString trước trim
const nameSchema: ParamSchema = {
  isString: { errorMessage: NAME_MESSAGES.STRING },
  trim: true,
  notEmpty: { errorMessage: NAME_MESSAGES.REQUIRED },
  isLength: { options: { min: 1, max: 100 }, errorMessage: NAME_MESSAGES.LENGTH },
}

const baseEmailSchema: ParamSchema = {
  trim: true,
  notEmpty: { errorMessage: EMAIL_MESSAGES.REQUIRED },
  isEmail: { errorMessage: EMAIL_MESSAGES.INVALID },
}

const dateOfBirthSchema: ParamSchema = {
  isString: { errorMessage: PASSWORD_MESSAGES.STRING },
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
  isString: { errorMessage: PASSWORD_MESSAGES.STRING },
  trim: true,
  notEmpty: { errorMessage: PASSWORD_MESSAGES.REQUIRED },
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
  isString: { errorMessage: PASSWORD_MESSAGES.CONFIRM_PASSWORD_IS_STRING },
  trim: true,
  notEmpty: { errorMessage: PASSWORD_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED },
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

const forgotPasswordTokenSchema: ParamSchema = {
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
}

const notAllowedSchema = <M extends string>(errorMessage: M): ParamSchema => {
  return {
    exists: {
      negated: true,
      errorMessage,
    },
  }
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

export const verifiedUserValidator = (req: Request, _res: Response, next: NextFunction) => {
  const { verify } = req.decoded_authorization as TokenPayload

  if (verify !== UserVerifyStatus.Verified) {
    return next(
      new ErrorWithStatus({
        message: USER_MESSAGES.NOT_VERIFIED_OR_BANDED,
        status_code: HttpStatusCode.Forbidden,
      })
    )
  }

  next()
}

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
  checkSchema({ forgot_password_token: forgotPasswordTokenSchema }, ['body'])
)

export const resetPasswordValidator = validate(
  checkSchema(
    {
      forgot_password_token: forgotPasswordTokenSchema,
      password: passwordSchema,
      confirm_password: confirmPasswordSchema,
    },
    ['body']
  )
)

export const updateMeValidator = validate(
  checkSchema(
    {
      name: { ...nameSchema, optional: true },
      date_of_birth: { ...dateOfBirthSchema, optional: true },
      bio: {
        isString: { errorMessage: BIO_MESSAGES.STRING },
        isLength: { options: { min: 1, max: 200 }, errorMessage: BIO_MESSAGES.LENGTH },
        optional: true,
      },
      location: {
        isString: { errorMessage: LOCATION_MESSAGES.STRING },
        isLength: { options: { min: 1, max: 200 }, errorMessage: LOCATION_MESSAGES.LENGTH },
        optional: true,
      },
      website: {
        trim: true,
        isURL: { errorMessage: WEBSITE_MESSAGES.INVALID },
        isLength: { options: { min: 1, max: 100 }, errorMessage: WEBSITE_MESSAGES.LENGTH },
        optional: true,
      },
      username: {
        isString: { errorMessage: USERNAME_MESSAGES.STRING },
        trim: true,
        matches: { options: /^(?=.*[a-zA-Z])[a-zA-Z0-9_]{4,50}$/, errorMessage: USERNAME_MESSAGES.INVALID },
        custom: {
          options: async (value: string) => {
            const user = await databaseService.users.findOne({ username: value })

            if (user) {
              throw new Error(USERNAME_MESSAGES.ALREADY_EXISTS)
            }

            return true
          },
        },
        optional: true,
      },
      avatar: {
        trim: true,
        isURL: { errorMessage: IMAGE_MESSAGES.URL_IS_INVALID },
        isLength: { options: { min: 1, max: 400 }, errorMessage: IMAGE_MESSAGES.LENGTH_OF_URL },
        optional: true,
      },
      cover_photo: {
        trim: true,
        isURL: { errorMessage: IMAGE_MESSAGES.URL_IS_INVALID },
        isLength: { options: { min: 1, max: 400 }, errorMessage: IMAGE_MESSAGES.LENGTH_OF_URL },
        optional: true,
      },
      email: notAllowedSchema(EMAIL_MESSAGES.NOT_ALLOWED_TO_CHANGE_EMAIL),
      password: notAllowedSchema(PASSWORD_MESSAGES.CANNOT_CHANGE_PASSWORD_BY_THIS_METHOD),
      email_verify_token: notAllowedSchema(AUTHENTICATION_MESSAGES.NOT_ALLOWED_TO_CHANGE_EMAIL_VERIFY_TOKEN),
      forgot_password_token: notAllowedSchema(AUTHENTICATION_MESSAGES.NOT_ALLOWED_TO_CHANGE_FORGOT_PASSWORD_TOKEN),
      verify: notAllowedSchema(USER_MESSAGES.NOT_ALLOWED_TO_CHANGE_VERIFY_STATUS),
    },
    ['body']
  )
)

export const getProfileValidator = validate(
  checkSchema(
    {
      username: {
        matches: { options: /^(?=.*[a-zA-Z])[a-zA-Z0-9_]{4,50}$/, errorMessage: USERNAME_MESSAGES.INVALID },
      },
    },
    ['params']
  )
)
