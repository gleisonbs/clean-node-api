import { IMiddleware } from '../protocols/middleware'
import { IHttpRequest, IHttpResponse } from '../protocols'
import { forbidden } from '../helpers/http/http-helper'
import { ILoadAccountByToken } from '../../domain/use-cases/load-account-by-token'

export class AuthMiddleware implements IMiddleware {
  constructor (private readonly loadAccountByToken: ILoadAccountByToken) {
    this.loadAccountByToken = loadAccountByToken
  }

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const accessToken = httpRequest.headers['x-access-token']
    if (accessToken) {
      await this.loadAccountByToken.load(accessToken)
    }
    return forbidden()
  }
}
