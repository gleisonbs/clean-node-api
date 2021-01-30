import { IValidation } from '../../protocols/validation'
import { InvalidParamError } from '../../errors'
import { IEmailValidator } from '../../protocols/email-validator'

export class EmailValidation implements IValidation {
  constructor (private readonly emailValidator: IEmailValidator) {
    this.emailValidator = emailValidator
  }

  validate (input: any): Error | null {
    if (!this.emailValidator.isValid(input.email)) {
      return new InvalidParamError('email')
    }
    return null
  }
}
