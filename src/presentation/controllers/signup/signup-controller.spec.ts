import { IAccountModel, IAddAccount, IAddAccountModel, IValidation, IAuthentication, IAuthenticationModel } from './signup-controller-protocols'
import { SignUpController } from './signup-controller'
import { MissingParamError } from '../../errors'
import { IHttpRequest } from '../../protocols'
import { ok, badRequest, serverError, forbidden } from '../../helpers/http/http-helper'

const id = 'test.id'
const name = 'Test User'
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

const makeHttpRequest = (): IHttpRequest => {
  return {
    body: {
      email,
      name,
      password,
      passwordConfirmation: password
    }
  }
}

const makeAddAccount = (): IAddAccount => {
  class AddAccountStub implements IAddAccount {
    async add (account: IAddAccountModel): Promise<IAccountModel|null> {
      const fakeAccount = {
        id,
        name,
        email,
        password
      }
      return fakeAccount
    }
  }
  return new AddAccountStub()
}

const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: SignUpController
  addAccountStub: IAddAccount
  validationStub: IValidation
  authenticationStub: IAuthentication
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const authenticationStub = makeAuthentication()
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)
  return { sut, addAccountStub, validationStub, authenticationStub }
}

describe('SignUp Controller', () => {
  it('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add')
      .mockImplementationOnce(async () => {
        return await new Promise((resolve, reject) => reject(new Error()))
      })
    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = makeHttpRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toBeCalledWith({ name, email, password })
  })

  it('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockResolvedValueOnce(null)

    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden())
  })

  it('Should return 200 if valid params are provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ accessToken }))
  })

  it('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeHttpRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toBeCalledWith(httpRequest.body)
  })

  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    const field = 'test.field'
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError(field))

    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError(field)))
  })

  it('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')

    await sut.handle(makeHttpRequest())
    expect(authSpy).toBeCalledWith({ email, password })
  })

  it('Should returns 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth')
      .mockRejectedValueOnce(new Error())

    const httpRequest: IHttpRequest = makeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
