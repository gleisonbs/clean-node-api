import { ILoadSurveyRepository } from '../../protocols/db/survey/load-surveys-repository'
import { ISurveyModel } from '../../../domain/models/survey'
import { DbLoadSurveys } from './db-load-surveys'

interface SutTypes {
  sut: DbLoadSurveys
  loadSurveysRepositoryStub: ILoadSurveyRepository
}

const makeLoadSurveysRepository = (): ILoadSurveyRepository => {
  class LoadSurveysRepository implements ILoadSurveyRepository {
    async loadAll (): Promise<ISurveyModel[]> { return [] }
  }

  return new LoadSurveysRepository()
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = makeLoadSurveysRepository()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
  return { sut, loadSurveysRepositoryStub }
}

describe('DbLoadSurveys', () => {
  it('Should call LoadSurveysRepository ', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadAllSpy).toBeCalled()
  })
})
