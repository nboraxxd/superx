import { HttpStatusCode } from 'axios'

import { COMMON_MESSAGES } from '@/constants/message'

type ErrorsType = Record<string, { msg: string; [key: string]: any }>

type TStatusCode = (typeof HttpStatusCode)[keyof typeof HttpStatusCode]

export class ErrorWithStatusCode {
  message: string
  status_code: TStatusCode

  constructor({ message, status_code }: { message: string; status_code: TStatusCode }) {
    this.message = message
    this.status_code = status_code
  }
}

export class EntityError extends ErrorWithStatusCode {
  errors: ErrorsType

  constructor({ message = COMMON_MESSAGES.VALIDATION_ERROR, errors }: { message?: string; errors: ErrorsType }) {
    super({ message, status_code: HttpStatusCode.UnprocessableEntity })
    this.errors = errors
  }
}
