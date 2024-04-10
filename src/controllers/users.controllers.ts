import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { HttpStatusCode } from 'axios'

import usersService from '@/services/users.services'
import { AUTHENTICATION_MESSAGES } from '@/constants/message'
import { RegisterReqBody } from '@/models/requests/User.requests'

export const loginController = (req: Request, res: Response) => {
  res.json({ message: 'User logged in' })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const { name, email, date_of_birth, password } = req.body

  const result = await usersService.register({ name, email, date_of_birth, password })
  return res.status(HttpStatusCode.Created).json({ message: AUTHENTICATION_MESSAGES.REGISTER_SUCCESS, result })
}
