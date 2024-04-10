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

export function verifyToken<T>(token: string, secretOrPublicKey: string) {
  return new Promise<T>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (err, decoded) => {
      if (err) {
        throw reject(err)
      }

      resolve(decoded as T)
    })
  })
}
