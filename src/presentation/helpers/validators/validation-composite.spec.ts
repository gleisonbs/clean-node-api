import { ValidationComposite } from './validation-composite'
import { MissingParamError } from '../../errors'
import { IValidation } from './validation'

class ValidationStub implements IValidation {
  validate (input: any): Error {
    return new MissingParamError('field')
  }
}

describe('Validation Composite', () => {
  it('Should return an error if any validation fails', async () => {
    const validationStub = new ValidationStub()
    const sut = new ValidationComposite([validationStub])
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
