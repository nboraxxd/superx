import express from 'express'

import envConfig, { API_URL } from '@/config'
import usersRouter from '@/routes/users.routes'
import databaseService from '@/services/database.services'

const app = express()
const port = envConfig.PORT

app.use(express.json())
app.use('/users', usersRouter)
databaseService.connect()

app.listen(port, () => {
  console.log(`App listening at ${API_URL}`)
})
