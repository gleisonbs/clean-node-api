import { CompareFieldsValidation } from './compare-fields-validation'
import { InvalidParamError } from '../../errors'
import { IValidation } from './validation'

const makeSut = (): IValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompareTo')
}

describe('Required Field Validation', () => {
  it('Should return MissingParamError if validation fails', async () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'test.field', fieldToCompareTo: 'test.different.field' })
    expect(error).toEqual(new InvalidParamError('fieldToCompareTo'))
  })

  it('Should return null if validation succeeds', async () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'field', fieldToCompareTo: 'field' })
    expect(error).toBeFalsy()
  })
})
