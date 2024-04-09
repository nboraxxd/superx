import envConfig from '@/config'
import { createHash } from 'node:crypto'

function sha256(content: string) {
  return createHash('sha256').update(content).digest('hex')
}

export function hashPassword(password: string) {
  return sha256(password + envConfig.PASSWORD_SUFFIX_SECRET)
}
