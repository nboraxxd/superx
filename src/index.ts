import express from 'express'
import userRouter from '@/user.routes'

const app = express()

const port = 3000

// middleware that is specific to userRouter
userRouter.use(
  (req, res, next) => {
    console.log('Time: ', Date.now())
    next()
  },
  (req, res, next) => {
    console.log('Time: ', Date.now())
    next()
  }
)

app.use('/api', userRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
