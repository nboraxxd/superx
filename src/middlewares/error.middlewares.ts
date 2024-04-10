import { HttpStatusCode } from 'axios'
import { NextFunction, Request, Response } from 'express'

export function defaultErrorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.log('🍓 ERROR:', err.message)

  const { status_code, ...errorExcludedStatusCode } = err

  res.status(status_code || HttpStatusCode.InternalServerError).json(errorExcludedStatusCode)
}
