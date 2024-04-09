import { Router } from 'express'

import { wrapRequestHandler } from '@/utils/handlers'
import { loginValidator, registerValidator } from '@/middlewares/users.middlewares'
import { loginController, registerController } from '@/controllers/users.controllers'

const usersRouter = Router()

usersRouter.post('/login', loginValidator, loginController)

/**
 * Description: Register a new user
 * Path: /register
 * Method: POST
 * Body: { name: string, email: string, date_of_birth: ISO8601, password: string, confirm_password: string }
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

export default usersRouter
