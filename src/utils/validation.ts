import express from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'

// sequential processing, stops running validations chain if the previous one fails.
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validation.run(req)

    const errors = validationResult(req)

    // Kiểm tra errors.isEmpty(), `isEmpty` là có trống hay không
    // Nếu có lỗi thì có nghĩa là không trống, errors.isEmpty() trả về false, không cho phép đi tiếp
    // Nếu không có lỗi thì là empty, errors.isEmpty() trả về true, cho phép next()
    if (errors.isEmpty()) {
      return next()
    }

    res.status(400).json({ errors: errors.mapped() })
  }
}
