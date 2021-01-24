import { LoginController } from './login'
import { IHttpRequest } from '../../protocols'
import { badRequest, serverError } from '../../helpers/http-helper'
import { MissingParamError, InvalidParamError } from '../../errors'
import { IEmailValidator } from '../signup/signup-protocols'

const email = 'test.user@email.com'
const password = 'test.password'

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
}

const makeSut = (): SutTypes => {
  const emailValidator = makeEmailValidator()
  const sut = new LoginController(emailValidator)
  return {
    sut,
    emailValidator
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
})
