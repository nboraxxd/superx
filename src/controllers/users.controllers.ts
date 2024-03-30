import { Request, Response } from 'express'

import usersService from '@/services/users.services'

export const loginController = (req: Request, res: Response) => {
  res.json({ message: 'User logged in' })
}

export const registerController = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const result = await usersService.register({ email, password })

    return res.status(201).json({ message: 'User registered', result })
  } catch (error) {
    return res.status(400).json({ message: 'User registration failed', error })
  }
}
