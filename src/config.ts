import fs from 'fs'
import path from 'path'
import z from 'zod'
import { config } from 'dotenv'

config({
  path: '.env.development',
})

const checkEnv = async () => {
  const chalk = (await import('chalk')).default

  if (!fs.existsSync(path.resolve('.env.development'))) {
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
})

const configServer = configSchema.safeParse(process.env)

if (!configServer.success) {
  console.error(configServer.error.issues)
  throw new Error('Các giá trị khai báo trong file .env không hợp lệ')
}

const envConfig = configServer.data
export const API_URL = `${envConfig.PROTOCOL}://${envConfig.DOMAIN}:${envConfig.PORT}`
export default envConfig
