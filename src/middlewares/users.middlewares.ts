import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'

import usersService from '@/services/users.services'
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
      notEmpty: true,
      isLength: { options: { min: 6, max: 50 } },
      isStrongPassword: {
        options: {
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        },
        errorMessage: 'Password must contain at least 1 lowercase, 1 uppercase, 1 number, 1 symbol',
      },
    },
    confirm_password: {
      trim: true,
      notEmpty: true,
      isLength: { options: { min: 6, max: 50 } },
      isStrongPassword: {
        options: {
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        },
        errorMessage: 'Password must contain at least 1 lowercase, 1 uppercase, 1 number, 1 symbol',
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Passwords do not match')
          }

          return true
        },
      },
    },
  })
)
