import { RequiredFieldValidation } from './required-field-validation'
import { MissingParamError } from '../../errors'

describe('Required Field Validation', () => {
  it('Should return MissingParamError if validation fails', async () => {
    const fieldName = 'testfield'
    const sut = new RequiredFieldValidation(fieldName)
    const error = sut.validate({})
    expect(error).toEqual(new MissingParamError(fieldName))
  })

  it('Should return null if validation succeeds', async () => {
    const fieldName = 'testfield'
    const sut = new RequiredFieldValidation(fieldName)
    const error = sut.validate({ testfield: fieldName })
    expect(error).toBeFalsy()
  })
})
