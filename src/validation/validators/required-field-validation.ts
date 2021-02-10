import { IValidation } from '../../presentation/protocols/validation'
import { MissingParamError } from '../../presentation/errors'

export class RequiredFieldValidation implements IValidation {
  constructor (private readonly fieldName: string) {
    this.fieldName = fieldName
  }

  validate (input: any): Error | null {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
    return null
  }
}
