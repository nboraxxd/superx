import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { HttpStatusCode } from 'axios'
import { ObjectId } from 'mongodb'

import User from '@/models/schemas/User.schema'
import usersService from '@/services/users.services'
import databaseService from '@/services/database.services'
import { TokenPayload } from '@/models/requests/Token.requests'
import { AUTHENTICATION_MESSAGES, EMAIL_MESSAGES, USER_MESSAGES } from '@/constants/message'
import { LoginReqBody, LogoutReqBody, RegisterReqBody, VerifyEmailReqBody } from '@/models/requests/User.requests'

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const { name, email, date_of_birth, password } = req.body

  const result = await usersService.register({ name, email, date_of_birth, password })
  return res.status(HttpStatusCode.Created).json({ message: AUTHENTICATION_MESSAGES.REGISTER_SUCCESS, result })
}

export const verifyEmailController = async (req: Request<ParamsDictionary, any, VerifyEmailReqBody>, res: Response) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload

  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })

  if (!user) {
    return res.status(HttpStatusCode.NotFound).json({ message: USER_MESSAGES.NOT_FOUND })
  }

  // Nếu đã verify rồi thì trả về thông báo đã verify chớ không báo lỗi
  if (user.email_verify_token === '') {
    return res.json({ message: EMAIL_MESSAGES.ALREADY_VERIFIED_BEFORE })
  }

  const result = await usersService.verifyEmail(user_id)

  return res.json({ message: EMAIL_MESSAGES.VERIFY_SUCCESS, result })
}

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId

  const result = await usersService.login(user_id.toString())

  return res.json({ message: AUTHENTICATION_MESSAGES.LOGIN_SUCCESS, result })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const { refresh_token } = req.body

  const result = await usersService.logout(refresh_token)

  return res.json(result)
}
