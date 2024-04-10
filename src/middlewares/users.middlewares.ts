import { ParamSchema, checkSchema } from 'express-validator'

import databaseService from '@/services/database.services'
import { validate } from '@/utils/validation'
import { hashPassword } from '@/utils/crypto'
import {
  AUTHENTICATION_MESSAGES,
  DATE_MESSAGES,
  EMAIL_MESSAGES,
  NAME_MESSAGES,
  PASSWORD_MESSAGES,
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
    options: (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(PASSWORD_MESSAGES.CONFIRM_PASSWORD_THE_SAME_AS_PASSWORD)
      }

      return true
    },
  },
}

export const loginValidator = validate(
  checkSchema({
    email: {
      ...baseEmailSchema,
      custom: {
        options: async (value, { req }) => {
          const user = await databaseService.users.findOne({ email: value, password: hashPassword(req.body.password) })

          if (!user) {
            throw new Error(AUTHENTICATION_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT)
          }

          req.user = user
          return true
        },
      },
    },
    password: passwordSchema,
  })
)

export const registerValidator = validate(
  checkSchema({
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
  })
)
