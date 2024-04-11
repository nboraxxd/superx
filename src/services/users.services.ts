import { ObjectId } from 'mongodb'

import envConfig from '@/config'
import databaseService from '@/services/database.services'
import User from '@/models/schemas/User.schema'
import RefreshToken from '@/models/schemas/RefreshToken.schema'
import { RegisterReqBody } from '@/models/requests/User.requests'
import { TokenType, UserVerifyStatus } from '@/constants/enums'
import { AUTHENTICATION_MESSAGES, EMAIL_MESSAGES } from '@/constants/message'
import { signToken } from '@/utils/jwt'
import { hashPassword } from '@/utils/crypto'

class UsersService {
  private async signAccessToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.AccessToken },
      privateKey: envConfig.JWT_SECRET_ACCESS_TOKEN,
      options: {
        expiresIn: envConfig.JWT_ACCESS_TOKEN_EXPIRES_IN,
      },
    })
  }

  private async signRefreshToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.RefreshToken },
      privateKey: envConfig.JWT_SECRET_REFRESH_TOKEN,
      options: {
        expiresIn: envConfig.JWT_REFRESH_TOKEN_EXPIRES_IN,
      },
    })
  }

  private async signAccessTokenAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  private async signEmailVerifyToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.EmailVerifyToken },
      privateKey: envConfig.JWT_SECRET_EMAIL_VERIFY_TOKEN,
      options: {
        expiresIn: envConfig.JWT_EMAIL_VERIFY_TOKEN_EXPIRES_IN,
      },
    })
  }

  async register(payload: Omit<RegisterReqBody, 'confirm_password'>) {
    const { name, email, date_of_birth, password } = payload

    const user_id = new ObjectId()

    const [email_verify_token, access_token, refresh_token] = await Promise.all([
      this.signEmailVerifyToken(user_id.toString()),
      this.signAccessToken(user_id.toString()),
      this.signRefreshToken(user_id.toString()),
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
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken(user_id)

    // updated_at sẽ có thể có giá trị khác nhau dựa vào:
    // Thời điểm tạo giá trị cập nhật (dùng new Date())
    // Thời điểm MongoDB cập nhật giá trị (thời điểm này sẽ sau thời điểm tạo giá trị cập nhật một tý - dùng $currentDate hoặc updated_at: '$$NOW')
    await Promise.all([
      databaseService.users.updateOne(
        { _id: new ObjectId(user_id) },
        {
          $set: {
            email_verify_token: '',
            verify: UserVerifyStatus.Verified,
          },
          $currentDate: { updated_at: true },
        }
      ),
      databaseService.refreshTokens.insertOne(
        new RefreshToken({ token: refresh_token, user_id: new ObjectId(user_id) })
      ),
    ])

    return { access_token, refresh_token }
  }

  async resendEmailVerify(user_id: string) {
    const email_verify_token = await this.signEmailVerifyToken(user_id)
    console.log('🍨 email_verify_token:', email_verify_token)

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

  async login(user_id: string) {
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken(user_id)

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ token: refresh_token, user_id: new ObjectId(user_id) })
    )

    return { access_token, refresh_token }
  }

  async logout(refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({ token: refresh_token })

    return { message: AUTHENTICATION_MESSAGES.LOGOUT_SUCCESS }
  }
}

const usersService = new UsersService()
export default usersService
