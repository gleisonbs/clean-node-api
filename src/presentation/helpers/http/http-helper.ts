import { IHttpResponse } from '../../protocols/http'
import { ServerError, UnauthorizedError, ForbiddenError } from '../../errors'

export const badRequest = (error: Error): IHttpResponse => ({
  statusCode: 400,
  body: error
})

export const unauthorized = (): IHttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})

export const serverError = (err: Error): IHttpResponse => ({
  statusCode: 500,
  body: new ServerError(err.stack)
})

export const ok = (data: any): IHttpResponse => ({
  statusCode: 200,
  body: data
})

export const forbidden = (): IHttpResponse => ({
  statusCode: 403,
  body: new ForbiddenError()
})
