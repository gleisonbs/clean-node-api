import { ILoadSurveyRepository } from '../../protocols/db/survey/load-surveys-repository'
import { ISurveyModel } from '../../../domain/models/survey'
import { DbLoadSurveys } from './db-load-surveys'

describe('DbLoadSurveys', () => {
  it('Should call LoadSurveysRepository ', async () => {
    class LoadSurveysRepository implements ILoadSurveyRepository {
      async loadAll (): Promise<ISurveyModel[]> { return [] }
    }
    const loadSurveysRepositoryStub = new LoadSurveysRepository()
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
    await sut.load()
    expect(loadAllSpy).toBeCalled()
  })
})
