import { ObjectId } from 'mongodb'

import envConfig from '@/config'
import databaseService from '@/services/database.services'
import User from '@/models/schemas/User.schema'
import RefreshToken from '@/models/schemas/RefreshToken.schema'
import { RegisterReqBody } from '@/models/requests/User.requests'
import { TokenType, UserVerifyStatus } from '@/constants/enums'
import { AUTHENTICATION_MESSAGES, EMAIL_MESSAGES, USER_MESSAGES } from '@/constants/message'
import { signToken } from '@/utils/jwt'
import { hashPassword } from '@/utils/crypto'

class UsersService {
  private async signAccessToken(user_id: string, verify: UserVerifyStatus) {
    return signToken({
      payload: { user_id, token_type: TokenType.AccessToken, verify },
      privateKey: envConfig.JWT_SECRET_ACCESS_TOKEN,
      options: {
        expiresIn: envConfig.JWT_ACCESS_TOKEN_EXPIRES_IN,
      },
    })
  }

  private async signRefreshToken(user_id: string, verify: UserVerifyStatus) {
    return signToken({
      payload: { user_id, token_type: TokenType.RefreshToken, verify },
      privateKey: envConfig.JWT_SECRET_REFRESH_TOKEN,
      options: {
        expiresIn: envConfig.JWT_REFRESH_TOKEN_EXPIRES_IN,
      },
    })
  }

  private async signAccessTokenAndRefreshToken(user_id: string, verify: UserVerifyStatus) {
    return Promise.all([this.signAccessToken(user_id, verify), this.signRefreshToken(user_id, verify)])
  }

  private async signEmailVerifyToken(user_id: string, verify: UserVerifyStatus) {
    return signToken({
      payload: { user_id, token_type: TokenType.EmailVerifyToken, verify },
      privateKey: envConfig.JWT_SECRET_EMAIL_VERIFY_TOKEN,
      options: {
        expiresIn: envConfig.JWT_EMAIL_VERIFY_TOKEN_EXPIRES_IN,
      },
    })
  }

  private async signForgotPasswordToken(user_id: string, verify: UserVerifyStatus) {
    return signToken({
      payload: { user_id, token_type: TokenType.ForgotPasswordToken, verify },
      privateKey: envConfig.JWT_SECRET_FORGOT_PASSWORD_TOKEN,
      options: {
        expiresIn: envConfig.JWT_FORGOT_PASSWORD_TOKEN_EXPIRES_IN,
      },
    })
  }

  async register(payload: Omit<RegisterReqBody, 'confirm_password'>) {
    const { name, email, date_of_birth, password } = payload

    const user_id = new ObjectId()
    const unverified = UserVerifyStatus.Unverified

    const [email_verify_token, access_token, refresh_token] = await Promise.all([
      this.signEmailVerifyToken(user_id.toString(), unverified),
      this.signAccessToken(user_id.toString(), unverified),
      this.signRefreshToken(user_id.toString(), unverified),
    ])

    console.log('🍨 email_verify_token:', email_verify_token)

    await Promise.all([
      databaseService.users.insertOne(
        new User({
          _id: user_id,
          name,
          email,
          date_of_birth: new Date(date_of_birth),
          password: hashPassword(password),
          email_verify_token,
        })
      ),
      databaseService.refreshTokens.insertOne(
        new RefreshToken({ token: refresh_token, user_id: new ObjectId(user_id) })
      ),
    ])

    return { access_token, refresh_token }
  }

  async verifyEmail(user_id: string) {
    // updated_at sẽ có thể có giá trị khác nhau dựa vào:
    // Thời điểm tạo giá trị cập nhật (dùng new Date())
    // Thời điểm MongoDB cập nhật giá trị (thời điểm này sẽ sau thời điểm tạo giá trị cập nhật một tý - dùng $currentDate hoặc updated_at: '$$NOW')
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          email_verify_token: '',
          verify: UserVerifyStatus.Verified,
        },
        $currentDate: { updated_at: true },
      }
    )

    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken(user_id, UserVerifyStatus.Verified)

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ token: refresh_token, user_id: new ObjectId(user_id) })
    )

    return { access_token, refresh_token }
  }

  async resendEmailVerify(user_id: string) {
    const email_verify_token = await this.signEmailVerifyToken(user_id, UserVerifyStatus.Unverified)
    console.log('🍨 resend ~ email_verify_token:', email_verify_token)

    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          email_verify_token,
        },
        $currentDate: { updated_at: true },
      }
    )

    return { message: EMAIL_MESSAGES.RESEND_EMAIL_VERIFY_SUCCESS }
  }

  async login(user_id: string, verify: UserVerifyStatus) {
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken(user_id, verify)

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ token: refresh_token, user_id: new ObjectId(user_id) })
    )

    return { access_token, refresh_token }
  }

  async logout(refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({ token: refresh_token })

    return { message: AUTHENTICATION_MESSAGES.LOGOUT_SUCCESS }
  }

  async forgotPassword(user_id: string, verify: UserVerifyStatus) {
    const forgot_password_token = await this.signForgotPasswordToken(user_id, verify)
    console.log('🛴 forgot_password_token:', forgot_password_token)

    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          forgot_password_token,
        },
        $currentDate: { updated_at: true },
      }
    )

    return { message: EMAIL_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD }
  }

  async resetPassword({ user_id, password, verify }: { user_id: string; password: string; verify: UserVerifyStatus }) {
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(user_id, verify),
      this.signRefreshToken(user_id, verify),
      databaseService.users.updateOne(
        { _id: new ObjectId(user_id) },
        {
          $set: {
            password: hashPassword(password),
            forgot_password_token: '',
          },
          $currentDate: { updated_at: true },
        }
      ),
    ])

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ token: refresh_token, user_id: new ObjectId(user_id) })
    )

    return { access_token, refresh_token }
  }

  async getMe(user_id: ObjectId) {
    const user = await databaseService.users.findOne(
      { _id: user_id },
      { projection: { password: 0, email_verify_token: 0, forgot_password_token: 0 } }
    )

    if (!user) {
      return { message: USER_MESSAGES.NOT_FOUND }
    }

    return user
  }
}

const usersService = new UsersService()
export default usersService
