import { ValidationComposite, RequiredFieldValidation } from '../../../../../validation/validators'
import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { IValidation } from '../../../../../presentation/protocols/validation'

jest.mock('../../../../../validation/validators/validation-composite')

describe('AddSurvey Validation Factory', () => {
  it('Should call ValidationComposite with all validations', async () => {
    makeAddSurveyValidation()
    const validations: IValidation[] = []
    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(
      validations
    )
  })
})
