import envConfig from '@/config'
import User from '@/models/schemas/User.schema'
import databaseService from '@/services/database.services'
import { TokenType } from '@/constants/enums'
import { hashPassword } from '@/utils/crypto'
import { signToken } from '@/utils/jwt'
import { RegisterReqBody } from '@/models/requests/User.requests'

class UsersService {
  private async signAccessToken(userId: string) {
    return signToken({
      payload: { userId, token_type: TokenType.AccessToken },
      privateKey: envConfig.JWT_SECRET_ACCESS_TOKEN,
      options: {
        expiresIn: envConfig.JWT_ACCESS_TOKEN_EXPIRES_IN,
      },
    })
  }

  private async signRefreshToken(userId: string) {
    return signToken({
      payload: { userId, token_type: TokenType.RefreshToken },
      privateKey: envConfig.JWT_SECRET_REFRESH_TOKEN,
      options: {
        expiresIn: envConfig.JWT_REFRESH_TOKEN_EXPIRES_IN,
      },
    })
  }

  async isEmailExists(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }

  async register(payload: Omit<RegisterReqBody, 'confirm_password'>) {
    const { name, email, date_of_birth, password } = payload

    const result = await databaseService.users.insertOne(
      new User({ name, email, date_of_birth: new Date(date_of_birth), password: hashPassword(password) })
    )

    const user_id = result.insertedId.toString()

    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id),
    ])

    return { access_token, refresh_token }
  }
}

const usersService = new UsersService()
export default usersService
