import express from 'express'

import envConfig, { API_URL } from '@/config'
import usersRouter from '@/routes/users.routes'
import databaseService from '@/services/database.services'

const port = envConfig.PORT
const app = express()

// parse json của client gởi lên, chuyển thành dạnh object để xử lý
app.use(express.json())

app.use('/users', usersRouter)

// kết nối với database
databaseService.connect()

app.listen(port, () => {
  console.log(`App listening at ${API_URL}`)
})
