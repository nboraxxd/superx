import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '@/constants/enums'

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  iat: number
  exp: number
}
