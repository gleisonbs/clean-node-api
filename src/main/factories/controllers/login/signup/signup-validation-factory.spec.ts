import { ValidationComposite, RequiredFieldValidation, CompareFieldsValidation, EmailValidation } from '../../../../../validation/validators'
import { makeSignUpValidation } from './signup-validation-factory'
import { IValidation } from '../../../../../presentation/protocols/validation'
import { IEmailValidator } from '../../../../../validation/protocols/email-validator'

jest.mock('../../../../../validation/validators/validation-composite')

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SignUp Validation Factory', () => {
  it('Should call ValidationComposite with all validations', async () => {
    makeSignUpValidation()
    const validations: IValidation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation(makeEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(
      validations
    )
  })
})
