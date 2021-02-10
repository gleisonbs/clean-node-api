import { EmailValidation } from './email-validation'
import { IEmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '../../presentation/errors'

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: IEmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation(emailValidatorStub)
  return { sut, emailValidatorStub }
}

describe('Email Validation', () => {
  it('Should call email validator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    sut.validate({ email: 'test.invalid.email.com' })
    expect(isValidSpy).toBeCalledWith('test.invalid.email.com')
  })

  it('Should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const error = sut.validate({ email: 'test.invalid.email.com' })
    expect(error).toEqual(new InvalidParamError('email'))
  })

  it('Should return 500 if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid')
      .mockImplementationOnce(() => { throw new Error() })

    expect(sut.validate).toThrow()
  })
})
