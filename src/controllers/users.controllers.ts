import { ObjectId } from 'mongodb'
import { HttpStatusCode } from 'axios'
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { JsonWebTokenError } from 'jsonwebtoken'

import envConfig from '@/config'
import User from '@/models/schemas/User.schema'
import usersService from '@/services/users.services'
import databaseService from '@/services/database.services'
import { verifyToken } from '@/utils/jwt'
import { calculateSecondsDifference, capitalizeFirstLetter } from '@/utils/common'
import { UserVerifyStatus } from '@/constants/enums'
import { AUTHENTICATION_MESSAGES, EMAIL_MESSAGES, PASSWORD_MESSAGES, USER_MESSAGES } from '@/constants/message'
import { TokenPayload } from '@/models/requests/Token.requests'
import { ErrorWithStatusAndPath } from '@/models/Errors'
import {
  ForgotPasswordReqBody,
  LoginReqBody,
  LogoutReqBody,
  RegisterReqBody,
  VerifyEmailReqBody,
  VerifyForgotPasswordReqBody,
} from '@/models/requests/User.requests'

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
  try {
    const { iat: emailVerifyTokenIat } = await verifyToken({
      token: user.email_verify_token,
      secretOrPublicKey: envConfig.JWT_SECRET_EMAIL_VERIFY_TOKEN,
    })

    const emailResendDelaySeconds = calculateSecondsDifference(
      emailVerifyTokenIat,
      envConfig.RESEND_EMAIL_DEBOUNCE_TIME
    )

    // Nếu khoảng cách giữa thời gian iat + 60s và thời gian hiện tại lớn hơn 0 thì trả về thông báo
    if (emailResendDelaySeconds > 0) {
      return res.status(HttpStatusCode.TooManyRequests).json({
        message: `Please try again in ${emailResendDelaySeconds}s`,
      })
    }
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      if (error.name === 'TokenExpiredError') {
        const result = await usersService.resendEmailVerify(user_id)

        return res.json(result)
      } else {
        throw new ErrorWithStatusAndPath({
          message: capitalizeFirstLetter(error.message),
          status_code: HttpStatusCode.Unauthorized,
          path: Object.keys(req.body)[0], // Lấy key của object đầu tiên trong req.body là `email_verify_token`
        })
      }
    } else {
      throw error
    }
  }

  const result = await usersService.resendEmailVerify(user_id)

  return res.json(result)
}

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  const { _id: user_id } = req.user as User

  const result = await usersService.login((user_id as ObjectId).toString())

  return res.json({ message: AUTHENTICATION_MESSAGES.LOGIN_SUCCESS, result })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const { refresh_token } = req.body

  const result = await usersService.logout(refresh_token)

  return res.json(result)
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordReqBody>,
  res: Response
) => {
  const { _id: user_id, forgot_password_token } = req.user as User

  if (forgot_password_token !== '') {
    try {
      const { iat: forgotPasswordTokenIat } = await verifyToken({
        token: forgot_password_token,
        secretOrPublicKey: envConfig.JWT_SECRET_FORGOT_PASSWORD_TOKEN,
      })

      const emailResendDelaySeconds = calculateSecondsDifference(
        forgotPasswordTokenIat,
        envConfig.RESEND_EMAIL_DEBOUNCE_TIME
      )

      // Nếu khoảng cách giữa thời gian iat + 60s và thời gian hiện tại lớn hơn 0 thì trả về thông báo
      if (emailResendDelaySeconds > 0) {
        return res.status(HttpStatusCode.TooManyRequests).json({
          message: `Please try again in ${emailResendDelaySeconds}s`,
        })
      }
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        if (error.name === 'TokenExpiredError') {
          const result = await usersService.forgotPassword((user_id as ObjectId).toString())

          return res.json(result)
        } else {
          throw new ErrorWithStatusAndPath({
            message: capitalizeFirstLetter(error.message),
            status_code: HttpStatusCode.Unauthorized,
            path: Object.keys(req.body)[0], // Lấy key của object đầu tiên trong req.body là `forgot_password_token`
          })
        }
      } else {
        throw error
      }
    }
  }

  const result = await usersService.forgotPassword((user_id as ObjectId).toString())

  return res.json(result)
}

export const verifyForgotPasswordController = async (
  req: Request<ParamsDictionary, any, VerifyForgotPasswordReqBody>,
  res: Response
) => {
  const { forgot_password_token } = req.body
  const { user_id } = req.decoded_forgot_password_token as TokenPayload

  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })

  if (!user) {
    return res.status(HttpStatusCode.NotFound).json({ message: USER_MESSAGES.NOT_FOUND })
  }

  if (user.forgot_password_token !== forgot_password_token) {
    return res
      .status(HttpStatusCode.Unauthorized)
      .json({ message: AUTHENTICATION_MESSAGES.INVALID_FORGOT_PASSWORD_TOKEN })
  }

  // Nếu forgot_password_token trong collection users là '' thì trả về thông báo đã token
  if (user.forgot_password_token === '') {
    return res.json({ message: AUTHENTICATION_MESSAGES.FORGOT_PASSWORD_TOKEN_HAS_BEEN_VERIFY })
  }

  return res.json({ message: PASSWORD_MESSAGES.VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS })
}
