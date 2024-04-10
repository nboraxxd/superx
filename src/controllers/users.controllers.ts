import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { HttpStatusCode } from 'axios'
import { ObjectId } from 'mongodb'

import User from '@/models/schemas/User.schema'
import usersService from '@/services/users.services'
import { AUTHENTICATION_MESSAGES } from '@/constants/message'
import { LoginReqBody, RegisterReqBody } from '@/models/requests/User.requests'

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId

  const result = await usersService.login(user_id.toString())

  return res.json({ message: AUTHENTICATION_MESSAGES.LOGIN_SUCCESS, result })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const { name, email, date_of_birth, password } = req.body

  const result = await usersService.register({ name, email, date_of_birth, password })
  return res.status(HttpStatusCode.Created).json({ message: AUTHENTICATION_MESSAGES.REGISTER_SUCCESS, result })
}
