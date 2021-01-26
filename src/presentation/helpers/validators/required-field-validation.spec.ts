import { RequiredFieldValidation } from './required-field-validation'
import { MissingParamError } from '../../errors'
import { IValidation } from './validation'

const makeSut = (): IValidation => {
  return new RequiredFieldValidation('field')
}

describe('Required Field Validation', () => {
  it('Should return MissingParamError if validation fails', async () => {
    const sut = makeSut()
    const error = sut.validate({})
    expect(error).toEqual(new MissingParamError('field'))
  })

  it('Should return null if validation succeeds', async () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'field' })
    expect(error).toBeFalsy()
  })
})
