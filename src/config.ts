import fs from 'fs'
import path from 'path'
import z from 'zod'
import { config } from 'dotenv'

const env = process.env.NODE_ENV

if (!env) {
  console.log('🚧 Không tìm thấy biến môi trường NODE_ENV')
  process.exit(1)
}

export const isProduction = env === 'production'

const envFileName = `.env.${env}`
console.log(`🛵 NODE_ENV = ${env}, app sẽ dùng file môi trường là ${envFileName}`)

if (!fs.existsSync(path.resolve(envFileName))) {
  console.log('🚧 Không tìm thấy file môi trường .env')
  process.exit(1)
}

config({
  path: envFileName,
})

const checkEnv = async () => {
  const chalk = (await import('chalk')).default

  if (!fs.existsSync(path.resolve(envFileName))) {
    console.log(chalk.red('Không tìm thấy file môi trường .env'))
    process.exit(1)
  }
}
checkEnv()

const configSchema = z.object({
  PROTOCOL: z.enum(['http', 'https']).default('http'),
  DOMAIN: z.string(),
  PORT: z.coerce.number().default(4000),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_CLUSTER: z.string(),
  DB_NAME: z.string(),
  DB_USERS_COLLECTION: z.string(),
  DB_REFRESH_TOKENS_COLLECTION: z.string(),

  PASSWORD_SUFFIX_SECRET: z.string(),

  JWT_SECRET_ACCESS_TOKEN: z.string(),
  JWT_SECRET_REFRESH_TOKEN: z.string(),
  JWT_SECRET_EMAIL_VERIFY_TOKEN: z.string(),
  JWT_SECRET_FORGOT_PASSWORD_TOKEN: z.string(),

  CLIENT_URL: z.string(),

  JWT_ACCESS_TOKEN_EXPIRES_IN: z.string(),
  JWT_REFRESH_TOKEN_EXPIRES_IN: z.string(),
  JWT_EMAIL_VERIFY_TOKEN_EXPIRES_IN: z.string(),
  JWT_FORGOT_PASSWORD_TOKEN_EXPIRES_IN: z.string(),
  RESEND_EMAIL_DEBOUNCE_TIME: z.coerce.number(),
})

const configServer = configSchema.safeParse(process.env)

if (!configServer.success) {
  console.error(configServer.error.issues)
  throw new Error('Các giá trị khai báo trong file .env không hợp lệ')
}

const envConfig = configServer.data
export const API_URL = `${envConfig.PROTOCOL}://${envConfig.DOMAIN}:${envConfig.PORT}`
export default envConfig
