import { LoginController } from './login'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { MissingParamError, InvalidParamError } from '../../errors'
import { IHttpRequest, IEmailValidator, IAuthentication } from '../login/login-protocols'

const email = 'test.user@email.com'
const password = 'test.password'
const accessToken = 'test.token'

const makeAuthentication = (): IAuthentication => {
  class AuthenticationStub implements IAuthentication {
    async auth (email: string, password: string): Promise<string> {
      return accessToken
    }
  }
  return new AuthenticationStub()
}

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
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
  emailValidator: IEmailValidator
  authentication: IAuthentication
}

const makeSut = (): SutTypes => {
  const emailValidator = makeEmailValidator()
  const authentication = makeAuthentication()
  const sut = new LoginController(emailValidator, authentication)
  return {
    sut,
    emailValidator,
    authentication
  }
}

describe('Login Controller', () => {
  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpRequest: IHttpRequest = makeFakeRequest()
    httpRequest.body.email = undefined

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const httpRequest: IHttpRequest = makeFakeRequest()
    httpRequest.body.password = undefined

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidator } = makeSut()
    const isValidSpy = jest.spyOn(emailValidator, 'isValid')

    const httpRequest: IHttpRequest = makeFakeRequest()

    await sut.handle(httpRequest)
    expect(isValidSpy).toBeCalledWith(email)
  })

  it('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidator } = makeSut()
    jest.spyOn(emailValidator, 'isValid').mockReturnValueOnce(false)

    const httpRequest: IHttpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidator } = makeSut()
    jest.spyOn(emailValidator, 'isValid')
      .mockImplementationOnce(() => { throw new Error() })

    const httpRequest: IHttpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should call Authentication with correct values', async () => {
    const { sut, authentication } = makeSut()
    const authSpy = jest.spyOn(authentication, 'auth')

    await sut.handle(makeFakeRequest())
    expect(authSpy).toBeCalledWith(email, password)
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
})
