import { HttpStatusCode } from 'axios'
import { NextFunction, Request, Response } from 'express'

import { ErrorWithStatus } from '@/models/Errors'

export function defaultErrorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.log('🍓 ERROR:', err.message)

  if (err instanceof ErrorWithStatus) {
    const { status_code, ...errorExcludedStatusCode } = err

    return res.status(status_code).json(errorExcludedStatusCode)
  } else {
    Object.getOwnPropertyNames(err).forEach((key) => {
      Object.defineProperty(err, key, { enumerable: true })
    })
    const { stack: _stack, ...errorExcludedStack } = err

    return res.status(HttpStatusCode.InternalServerError).json({ message: err.message, error_info: errorExcludedStack })
  }
}
