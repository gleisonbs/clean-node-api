import { IHttpRequest, IHttpResponse } from '../protocols/http'
import { forbidden, ok, serverError } from '../helpers/http/http-helper'
import { AuthMiddleware } from './auth-middleware'
import { ILoadAccountByToken } from '../../domain/use-cases/load-account-by-token'
import { IAccountModel } from '../../domain/models/account'

const makeFakeAccount = (): IAccountModel => ({
  id: 'test.id',
  email: 'test.email',
  name: 'test.name',
  password: 'test.password'
})

const makeFakeRequest = (): IHttpRequest => ({
  headers: {
    'x-access-token': 'test.token'
  }
})

const makeLoadAccountByToken = (): ILoadAccountByToken => {
  class LoadAccountByTokenStub implements ILoadAccountByToken {
    async load (accessToken): Promise<IAccountModel | null> {
      return makeFakeAccount()
    }
  }
  return new LoadAccountByTokenStub()
}

interface SutTypes {
  loadAccountByToken: ILoadAccountByToken
  sut: AuthMiddleware
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByToken = makeLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByToken, role)
  return { sut, loadAccountByToken }
}

describe('Auth Middleware', () => {
  it('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpRequest: IHttpRequest = makeFakeRequest()
    httpRequest.headers = {}

    const httpResponse: IHttpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden())
  })

  it('Should call LoadAccountByToken with correct accessToken', async () => {
    const role = 'test.role'
    const { sut, loadAccountByToken } = makeSut(role)
    const loadSpy = jest.spyOn(loadAccountByToken, 'load')

    const httpRequest: IHttpRequest = makeFakeRequest()

    await sut.handle(httpRequest)
    expect(loadSpy).toBeCalledWith('test.token', role)
  })

  it('Should return 403 if loadAccountByToken returns null', async () => {
    const { sut, loadAccountByToken } = makeSut()
    jest.spyOn(loadAccountByToken, 'load').mockResolvedValueOnce(null)

    const httpRequest: IHttpRequest = makeFakeRequest()
    const httpResponse: IHttpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden())
  })

  it('Should return 200 if loadAccountByToken returns an account', async () => {
    const { sut } = makeSut()

    const httpRequest: IHttpRequest = makeFakeRequest()
    const httpResponse: IHttpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ accountId: 'test.id' }))
  })

  it('Should return 50 if loadAccountByToken throws', async () => {
    const { sut, loadAccountByToken } = makeSut()
    jest.spyOn(loadAccountByToken, 'load').mockRejectedValueOnce(new Error())

    const httpRequest: IHttpRequest = makeFakeRequest()
    const httpResponse: IHttpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
