import { IMiddleware } from '../protocols/middleware'
import { IHttpRequest, IHttpResponse } from '../protocols'
import { forbidden, ok } from '../helpers/http/http-helper'
import { ILoadAccountByToken } from '../../domain/use-cases/load-account-by-token'

export class AuthMiddleware implements IMiddleware {
  constructor (private readonly loadAccountByToken: ILoadAccountByToken) {
    this.loadAccountByToken = loadAccountByToken
  }

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const accessToken = httpRequest.headers['x-access-token']
    if (accessToken) {
      const account = await this.loadAccountByToken.load(accessToken)
      if (account) {
        return ok({ accountId: account.id })
      }
    }
    return forbidden()
  }
}
