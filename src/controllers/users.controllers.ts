import { Request, Response } from 'express'

import User from '@/models/schemas/User.schema'
import databaseService from '@/services/database.services'

export const loginController = (req: Request, res: Response) => {
  res.json({ message: 'User logged in' })
}

export const registerController = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const result = await databaseService.users.insertOne(new User({ email, password }))

    return res.status(201).json({ message: 'User registered', data: result })
  } catch (error) {
    console.log('🔥 ~ registerController ~ error:', error)
    return res.status(400).json({ message: 'User registration failed', error })
  }
}
