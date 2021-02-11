import { IHttpResponse } from '../../protocols/http'
import { ServerError, UnauthorizedError, ForbiddenError } from '../../errors'

export const ok = (data: any): IHttpResponse => ({
  statusCode: 200,
  body: data
})

export const noContent = (): IHttpResponse => ({
  statusCode: 204,
  body: null
})

export const badRequest = (error: Error): IHttpResponse => ({
  statusCode: 400,
  body: error
})

export const unauthorized = (): IHttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})

export const forbidden = (): IHttpResponse => ({
  statusCode: 403,
  body: new ForbiddenError()
})

export const serverError = (err: Error): IHttpResponse => ({
  statusCode: 500,
  body: new ServerError(err.stack)
})
