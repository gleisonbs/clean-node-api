import { IAccountModel, IAddAccount, IAddAccountModel, IEmailValidator, IValidation } from './signup-protocols'
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
  emailValidatorStub: IEmailValidator
  addAccountStub: IAddAccount
  validationStub: IValidation
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const emailValidatorStub = makeEmailValidator()
  const validationStub = makeValidation()
  const sut = new SignUpController(emailValidatorStub, addAccountStub, validationStub)
  return { sut, emailValidatorStub, addAccountStub, validationStub }
}

describe('SignUp Controller', () => {
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
})
