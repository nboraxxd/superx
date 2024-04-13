import express from 'express'
import { HttpStatusCode } from 'axios'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import { validationResult, ValidationChain, matchedData } from 'express-validator'

import { EntityError, ErrorWithStatusAndPath } from '@/models/Errors'

// sequential processing, stops running validations chain if the previous one fails.
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validation.run(req)

    const result = validationResult(req)

    // Có lỗi là không empty, errors.isEmpty() return false. Không có lỗi là empty, errors.isEmpty() return true
    if (result.isEmpty()) {
      const data = matchedData(req, { locations: ['body', 'query', 'params'] })

      // Exclude undefined values
      for (const key in data) {
        if (data[key] === undefined) {
          delete data[key]
        }
      }

      res.locals = data

      return next()
    }

    const errorsObject = result.mapped()
    const entityError = new EntityError({ errors: {} })

    for (const key in errorsObject) {
      const { msg } = errorsObject[key]

      // Trả về lỗi không thuộc lỗi của quá trình validate
      if (msg instanceof ErrorWithStatusAndPath && msg.status_code !== HttpStatusCode.UnprocessableEntity) {
        return next(msg)
      }

      entityError.errors[key] = errorsObject[key]
    }

    next(entityError)
  }
}
