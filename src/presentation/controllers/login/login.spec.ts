import { LoginController } from './login'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http/http-helper'
import { MissingParamError } from '../../errors'
import { IHttpRequest, IAuthentication, IValidation, IAuthenticationModel } from '../login/login-protocols'

const email = 'test.user@email.com'
const password = 'test.password'
const accessToken = 'test.token'

const makeAuthentication = (): IAuthentication => {
  class AuthenticationStub implements IAuthentication {
    async auth (authentication: IAuthenticationModel): Promise<string> {
      return accessToken
    }
  }
  return new AuthenticationStub()
}

const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

const makeFakeRequest = (): IHttpRequest => {
  return {
    body: {
      email,
      password
    }
  }
}

interface SutTypes {
  sut: LoginController
  authentication: IAuthentication
  validationStub: IValidation
}

const makeSut = (): SutTypes => {
  const authentication = makeAuthentication()
  const validationStub = makeValidation()
  const sut = new LoginController(authentication, validationStub)
  return {
    sut,
    authentication,
    validationStub
  }
}

describe('Login Controller', () => {
  it('Should call Authentication with correct values', async () => {
    const { sut, authentication } = makeSut()
    const authSpy = jest.spyOn(authentication, 'auth')

    await sut.handle(makeFakeRequest())
    expect(authSpy).toBeCalledWith({ email, password })
  })

  it('Should returns 500 if Authentication throws', async () => {
    const { sut, authentication } = makeSut()
    jest.spyOn(authentication, 'auth')
      .mockRejectedValueOnce(new Error())

    const httpRequest: IHttpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authentication } = makeSut()
    jest.spyOn(authentication, 'auth')
      .mockResolvedValueOnce('')

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  it('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accessToken }))
  })

  it('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toBeCalledWith(httpRequest.body)
  })

  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    const field = 'test.field'
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError(field))

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError(field)))
  })
})
