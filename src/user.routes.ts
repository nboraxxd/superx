import { Router } from 'express'

const userRouter = Router()

// define the /users route
userRouter.get('/users', (req, res) => {
  res.json({ message: 'Hello World!' })
})

export default userRouter
