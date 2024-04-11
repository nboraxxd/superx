import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { HttpStatusCode } from 'axios'
import { ObjectId } from 'mongodb'
import { addSeconds, differenceInSeconds } from 'date-fns'

import envConfig from '@/config'
import User from '@/models/schemas/User.schema'
import usersService from '@/services/users.services'
import databaseService from '@/services/database.services'
import { verifyToken } from '@/utils/jwt'
import { UserVerifyStatus } from '@/constants/enums'
import { AUTHENTICATION_MESSAGES, EMAIL_MESSAGES, USER_MESSAGES } from '@/constants/message'
import { TokenPayload } from '@/models/requests/Token.requests'
import { LoginReqBody, LogoutReqBody, RegisterReqBody, VerifyEmailReqBody } from '@/models/requests/User.requests'

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const { name, email, date_of_birth, password } = req.body

  const result = await usersService.register({ name, email, date_of_birth, password })
  return res.status(HttpStatusCode.Created).json({ message: AUTHENTICATION_MESSAGES.REGISTER_SUCCESS, result })
}

export const verifyEmailController = async (req: Request<ParamsDictionary, any, VerifyEmailReqBody>, res: Response) => {
  const { email_verify_token } = req.body
  const { user_id } = req.decoded_email_verify_token as TokenPayload

  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })

  if (!user) {
    return res.status(HttpStatusCode.NotFound).json({ message: USER_MESSAGES.NOT_FOUND })
  }

  if (user.email_verify_token !== email_verify_token) {
    return res.status(HttpStatusCode.Unauthorized).json({ message: AUTHENTICATION_MESSAGES.INVALID_EMAIL_VERIFY_TOKEN })
  }

  // Nếu đã verify rồi thì trả về thông báo đã verify chớ không báo lỗi
  if (user.email_verify_token === '') {
    return res.json({ message: EMAIL_MESSAGES.ALREADY_VERIFIED_BEFORE })
  }

  const result = await usersService.verifyEmail(user_id)

  return res.json({ message: EMAIL_MESSAGES.VERIFY_SUCCESS, result })
}

export const resendEmailVerifyController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload

  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })

  if (!user) {
    return res.status(HttpStatusCode.NotFound).json({ message: USER_MESSAGES.NOT_FOUND })
  }

  if (user.verify === UserVerifyStatus.Verified && user.email_verify_token === '') {
    return res.json({ message: EMAIL_MESSAGES.ALREADY_VERIFIED_BEFORE })
  }

  // Verify email_verify_token
  const { iat: emailVerifyTokenIat } = await verifyToken({
    token: user.email_verify_token,
    secretOrPublicKey: envConfig.JWT_SECRET_EMAIL_VERIFY_TOKEN,
  })

  // Chuyển epoch time thành đối tượng Date
  const iatDate = new Date(emailVerifyTokenIat * 1000)

  // Lấy thời gian hiện tại
  const currentDate = new Date()

  // Cộng thêm 60s vào thời gian iat
  const sixtySecondsAfterIat = addSeconds(iatDate, 60)

  // Tính khoảng cách giây giữa thời gian iat + 60s và thời gian hiện tại
  const secondsDifference = differenceInSeconds(sixtySecondsAfterIat, currentDate)

  // Nếu khoảng cách giữa thời gian iat + 60s và thời gian hiện tại lớn hơn 0 thì trả về thông báo
  if (secondsDifference > 0) {
    return res.status(HttpStatusCode.TooManyRequests).json({
      message: `Please try again in ${secondsDifference}s`,
    })
  }

  const result = await usersService.resendEmailVerify(user_id)

  return res.json(result)
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
