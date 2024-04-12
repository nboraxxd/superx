import { HttpStatusCode } from 'axios'

import { COMMON_MESSAGES } from '@/constants/message'

type ErrorsType = Record<string, { msg: string; [key: string]: any }>

type TStatusCode = (typeof HttpStatusCode)[keyof typeof HttpStatusCode]

export class ErrorWithStatus {
  message: string
  status_code: TStatusCode

  constructor({ message, status_code }: { message: string; status_code: TStatusCode }) {
    this.message = message
    this.status_code = status_code
  }
}

export class ErrorWithStatusAndPath extends ErrorWithStatus {
  path: string

  constructor({ message, status_code, path }: { message: string; status_code: TStatusCode; path: string }) {
    super({ message, status_code })
    this.path = path
  }
}

export class EntityError extends ErrorWithStatus {
  errors: ErrorsType

  constructor({ message = COMMON_MESSAGES.VALIDATION_ERROR, errors }: { message?: string; errors: ErrorsType }) {
    super({ message, status_code: HttpStatusCode.UnprocessableEntity })
    this.errors = errors
  }
}
