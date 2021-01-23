import { IAccountModel, IAddAccount, IAddAccountModel, IEmailValidator } from './signup-protocols'
import { SignUpController } from './signup'
import { InvalidParamError, MissingParamError } from '../../errors'
import { IHttpRequest } from '../../protocols'
import { ok, badRequest, serverError } from '../../helpers/http-helper'

const id = 'test.id'
const name = 'Test User'
const email = 'test.user@email.com'
const password = 'test.password'

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

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccount = (): IAddAccount => {
  class AddAccountStub implements IAddAccount {
    async add (account: IAddAccountModel): Promise<IAccountModel> {
      const fakeAccount = {
        id,
        name,
        email,
        password
      }
      return await new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountStub()
}

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: IEmailValidator
  addAccountStub: IAddAccount
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const emailValidatorStub = makeEmailValidator()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return { sut, emailValidatorStub, addAccountStub }
}

describe('SignUp Controller', () => {
  it('Should return 400 if name is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    httpRequest.body.name = undefined
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  })

  it('Should return 400 if email is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    httpRequest.body.email = undefined
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it('Should return 400 if password is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    httpRequest.body.password = undefined
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  it('Should return 400 if password confirmation is not provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    httpRequest.body.passwordConfirmation = undefined
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
  })

  it('Should return 400 if password confirmation is different from password', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    httpRequest.body.passwordConfirmation = 'diff.test.password'
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
  })

  it('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = makeHttpRequest()
    httpRequest.body.email = 'test.invalid.email.com'
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('Should call email validator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = makeHttpRequest()
    await sut.handle(httpRequest)
    expect(isValidSpy).toBeCalledWith(httpRequest.body.email)
  })

  it('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid')
      .mockImplementationOnce(() => { throw new Error() })
    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

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

  it('Should return 200 if valid params are provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ name, email, password, id }))
  })
})
