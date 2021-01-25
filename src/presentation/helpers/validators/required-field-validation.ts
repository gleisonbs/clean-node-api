import { IValidation } from './validation'
import { MissingParamError } from '../../errors'

export class RequiredFieldValidation implements IValidation {
  private readonly fieldName: string

  constructor (fieldName: string) {
    this.fieldName = fieldName
  }

  validate (input: any): Error | null {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
    return null
  }
}
