import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import usersService from '@/services/users.services'
import { RegisterReqBody } from '@/models/requests/User.requests'

export const loginController = (req: Request, res: Response) => {
  res.json({ message: 'User logged in' })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const { name, email, date_of_birth, password } = req.body

  try {
    const result = await usersService.register({ name, email, date_of_birth, password })

    return res.status(201).json({ message: 'User registered', result })
  } catch (error) {
    return res.status(400).json({ message: 'User registration failed', error })
  }
}
