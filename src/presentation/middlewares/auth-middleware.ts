import { IMiddleware, ILoadAccountByToken, IHttpRequest, IHttpResponse } from './auth-middleware-protocols'
import { forbidden, ok, serverError } from '../helpers/http/http-helper'

export class AuthMiddleware implements IMiddleware {
  constructor (
    private readonly loadAccountByToken: ILoadAccountByToken,
    private readonly role?: string) {
    this.loadAccountByToken = loadAccountByToken
  }

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const accessToken = httpRequest.headers['x-access-token']
      if (accessToken) {
        const account = await this.loadAccountByToken.load(accessToken, this.role)
        if (account) {
          return ok({ accountId: account.id })
        }
      }
      return forbidden()
    } catch (err) {
      return serverError(err)
    }
  }
}
