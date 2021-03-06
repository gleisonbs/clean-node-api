import { DbAddSurvey } from './db-add-survey'
import { IAddSurveyModel, IAddSurveyRepository } from './db-add-survey-protocols'

const date = new Date()
const makeFakeSurveyData = (): IAddSurveyModel => ({
  question: 'test.question',
  answers: [
    {
      image: 'test.image',
      answer: 'test.answer'
    }
  ],
  date
})

interface SutTypes {
  sut: DbAddSurvey
  addSurveyRepositoryStub: IAddSurveyRepository
}

const makeAddSurveyRepository = (): IAddSurveyRepository => {
  class AddSurveyRepositoryStub implements IAddSurveyRepository {
    async add (surveyData: IAddSurveyModel): Promise<void> {
    }
  }
  return new AddSurveyRepositoryStub()
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return { sut, addSurveyRepositoryStub }
}

describe('DbAddSurvey UseCase', () => {
  it('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')

    const surveyData = makeFakeSurveyData()
    await sut.add(surveyData)
    expect(addSpy).toBeCalledWith(surveyData)
  })

  it('Should throw if AddSurveyRepository', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockRejectedValueOnce(new Error())

    const promise = sut.add(makeFakeSurveyData())
    await expect(promise).rejects.toThrow()
  })
})
