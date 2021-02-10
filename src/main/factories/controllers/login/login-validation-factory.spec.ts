import { ValidationComposite, RequiredFieldValidation, EmailValidation } from '../../../../presentation/helpers/validators'
import { makeLoginValidation } from './login-validation-factory'
import { IValidation } from '../../../../presentation/protocols/validation'
import { IEmailValidator } from '../../../../presentation/protocols/email-validator'

jest.mock('../../../../presentation/helpers/validators/validation-composite')

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('Login Validation Factory', () => {
  it('Should call ValidationComposite with all validations', async () => {
    makeLoginValidation()
    const validations: IValidation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new EmailValidation(makeEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(
      validations
    )
  })
})
