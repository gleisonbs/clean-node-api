import { IValidation } from '../../presentation/protocols/validation'
import { InvalidParamError } from '../../presentation/errors'

export class CompareFieldsValidation implements IValidation {
  constructor (private readonly fieldName: string, private readonly fieldToCompareName: string) {
    this.fieldName = fieldName
    this.fieldToCompareName = fieldToCompareName
  }

  validate (input: any): Error | null {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName)
    }
    return null
  }
}
