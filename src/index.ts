import express from 'express'

import envConfig, { API_URL } from '@/config'
import usersRouter from '@/routes/users.routes'
import databaseService from '@/services/database.services'
import { defaultErrorHandler } from '@/middlewares/error.middlewares'

const port = envConfig.PORT
const app = express()

// kết nối với database
databaseService.connect()

// parse json của client gởi lên, chuyển thành dạnh object để xử lý
app.use(express.json())

app.use('/users', usersRouter)

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`App listening at ${API_URL}`)
})
