import { NextFunction, Request, Response } from 'express'

type Func<P> = (
  req: Request<P, any, any, qs.ParsedQs, Record<string, any>>,
  res: Response,
  next: NextFunction
) => Promise<Response<any, Record<string, any>>>

export function wrapRequestHandler<P>(func: Func<P>) {
  return async (req: Request<P, any, any, qs.ParsedQs, Record<string, any>>, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
