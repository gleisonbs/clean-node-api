import { IHttpRequest } from '../../../protocols'
import { AddSurveyController } from './add-survey-controller'
import { IValidation } from '../../../protocols/validation'

const makeFakeRequest = (): IHttpRequest => ({
  body: {
    question: 'test.question',
    answer: [
      { image: 'test.image', answer: 'test.answer' }
    ]
  }
})

const makeValidationStub = (): IValidation => {
  class ValidationStub implements IValidation {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  validationStub: IValidation
  sut: AddSurveyController
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const sut = new AddSurveyController(validationStub)
  return { sut, validationStub }
}

describe('Add Survey controller', () => {
  it('Should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = makeFakeRequest()
    await sut.handle(makeFakeRequest())

    expect(validateSpy).toBeCalledWith(httpRequest.body)
  })
})
