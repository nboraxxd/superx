import { envVariables } from '@/env-variables'
import { createHash } from 'node:crypto'

function sha256(content: string) {
  return createHash('sha256').update(content).digest('hex')
}

export function hashPassword(password: string) {
  return sha256(password + (envVariables.PASSWORD_SUFFIX_SECRET as string))
}
