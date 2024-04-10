import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'

import usersService from '@/services/users.services'
import { PASSWORD_MESSAGES } from '@/constants/message'
import { validate } from '@/utils/validation'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' })
  }

  next()
}

export const registerValidator = validate(
  checkSchema({
    name: { trim: true, notEmpty: true, isLength: { options: { min: 1, max: 100 } } },
    email: {
      trim: true,
      notEmpty: true,
      isEmail: true,
      custom: {
        options: async (value: string) => {
          const isExistEmail = await usersService.isEmailExists(value)

          if (isExistEmail) {
            throw new Error('Email already exists')
          }

          return true
        },
      },
    },
    date_of_birth: {
      trim: true,
      notEmpty: true,
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true,
        },
      },
    },
    password: {
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
    },
    confirm_password: {
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
    },
  })
)
