import { IHttpRequest, IHttpResponse } from '../protocols/http'
import { forbidden } from '../helpers/http/http-helper'
import { AuthMiddleware } from './auth-middleware'
import { ILoadAccountByToken } from '../../domain/use-cases/load-account-by-token'
import { IAccountModel } from '../../domain/models/account'

const makeFakeAccount = (): IAccountModel => ({
  id: 'test.id',
  email: 'test.email',
  name: 'test.name',
  password: 'test.password'
})

const makeLoadAccountByToken = (): ILoadAccountByToken => {
  class LoadAccountByTokenStub implements ILoadAccountByToken {
    async load (accessToken): Promise<IAccountModel | null> {
      return makeFakeAccount()
    }
  }
  return new LoadAccountByTokenStub()
}

describe('Auth Middleware', () => {
  it('Should return 403 if no x-access-token exists in headers', async () => {
    const loadAccountByToken = makeLoadAccountByToken()
    const sut = new AuthMiddleware(loadAccountByToken)
    const httpRequest: IHttpRequest = {
      headers: {}
    }

    const httpResponse: IHttpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden())
  })

  it('Should call LoadAccountByToken with correct accessToken', async () => {
    const loadAccountByToken = makeLoadAccountByToken()
    const sut = new AuthMiddleware(loadAccountByToken)
    const loadSpy = jest.spyOn(loadAccountByToken, 'load')

    const httpRequest: IHttpRequest = {
      headers: {
        'x-access-token': 'test.token'
      }
    }

    await sut.handle(httpRequest)
    expect(loadSpy).toBeCalledWith('test.token')
  })
})
