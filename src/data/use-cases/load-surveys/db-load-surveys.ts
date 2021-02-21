import { ILoadSurveys } from '../../../domain/use-cases/load-surveys'
import { ILoadSurveyRepository } from '../../protocols/db/survey/load-surveys-repository'
import { ISurveyModel } from '../../../domain/models/survey'

export class DbLoadSurveys implements ILoadSurveys {
  constructor (private readonly loadSurveysRepository: ILoadSurveyRepository) {
    this.loadSurveysRepository = loadSurveysRepository
  }

  async load (): Promise<ISurveyModel[]> {
    await this.loadSurveysRepository.loadAll()
    return []
  }
}
