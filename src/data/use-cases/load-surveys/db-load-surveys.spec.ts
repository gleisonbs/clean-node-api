import { ILoadSurveyRepository } from '../../protocols/db/survey/load-surveys-repository'
import { ISurveyModel } from '../../../domain/models/survey'
import { DbLoadSurveys } from './db-load-surveys'

interface SutTypes {
  sut: DbLoadSurveys
  loadSurveysRepositoryStub: ILoadSurveyRepository
}

const date = new Date()
const makeFakeSurveys = (): ISurveyModel[] => ([
  {
    id: 'test.id',
    question: 'test.question',
    answers: [
      {
        image: 'test.image',
        answer: 'test.answer'
      }
    ],
    date
  },
  {
    id: 'test.id',
    question: 'test.question',
    answers: [
      {
        image: 'test.image',
        answer: 'test.answer'
      }
    ],
    date
  }
])

const makeLoadSurveysRepository = (): ILoadSurveyRepository => {
  class LoadSurveysRepository implements ILoadSurveyRepository {
    async loadAll (): Promise<ISurveyModel[]> { return makeFakeSurveys() }
  }

  return new LoadSurveysRepository()
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = makeLoadSurveysRepository()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
  return { sut, loadSurveysRepositoryStub }
}

describe('DbLoadSurveys', () => {
  it('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadAllSpy).toBeCalled()
  })

  it('Should return a list of surveys on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load()
    expect(surveys).toEqual(makeFakeSurveys())
  })
})
