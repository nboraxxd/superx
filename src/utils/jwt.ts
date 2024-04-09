import jwt, { SignOptions } from 'jsonwebtoken'

type SignToken = {
  payload: any
  privateKey: string
  options?: SignOptions
}

export function signToken({ payload, privateKey, options = { algorithm: 'HS256' } }: SignToken) {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) {
        throw reject(err)
      }

      resolve(token as string)
    })
  })
}
