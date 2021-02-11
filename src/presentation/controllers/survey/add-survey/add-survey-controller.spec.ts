import { IHttpRequest } from '../../../protocols'
import { AddSurveyController } from './add-survey-controller'
import { IValidation } from '../../../protocols/validation'
import { badRequest, serverError } from '../../../helpers/http/http-helper'
import { IAddSurveyModel, IAddSurvey } from './add-survey-controller-protocols'

const makeFakeRequest = (): IHttpRequest => ({
  body: {
    question: 'test.question',
    answers: [
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

const makeAddSurveyStub = (): IAddSurvey => {
  class AddSurveyStub implements IAddSurvey {
    async add (data: IAddSurveyModel): Promise<void> { }
  }
  return new AddSurveyStub()
}

interface SutTypes {
  validationStub: IValidation
  addSurveyStub: IAddSurvey
  sut: AddSurveyController
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const addSurveyStub = makeAddSurveyStub()
  const sut = new AddSurveyController(validationStub, addSurveyStub)
  return { sut, validationStub, addSurveyStub }
}

describe('Add Survey controller', () => {
  it('Should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = makeFakeRequest()
    await sut.handle(makeFakeRequest())

    expect(validateSpy).toBeCalledWith(httpRequest.body)
  })

  it('Should return 400 if validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  it('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toBeCalledWith(httpRequest.body)
  })

  it('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut()
    jest.spyOn(addSurveyStub, 'add').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
