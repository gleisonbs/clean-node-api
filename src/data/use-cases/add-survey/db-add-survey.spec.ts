import { DbAddSurvey } from './db-add-survey'
import { IAddSurveyModel, IAddSurveyRepository } from './db-add-survey-protocols'

const makeFakeSurveyData = (): IAddSurveyModel => ({
  question: 'test.question',
  answers: [
    {
      image: 'test.image',
      answer: 'test.answer'
    }
  ]

})

describe('DbAddSurvey UseCase', () => {
  it('Should call AddSurveyRepository with correct values', async () => {
    class AddSurveyRepositoryStub implements IAddSurveyRepository {
      async add (surveyData: IAddSurveyModel): Promise<void> {
      }
    }

    const addSurveyRepositoryStub = new AddSurveyRepositoryStub()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')

    const sut = new DbAddSurvey(addSurveyRepositoryStub)
    const surveyData = makeFakeSurveyData()
    await sut.add(surveyData)
    expect(addSpy).toBeCalledWith(surveyData)
  })
})
