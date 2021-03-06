import { IAddSurvey, IAddSurveyModel, IAddSurveyRepository } from './db-add-survey-protocols'

export class DbAddSurvey implements IAddSurvey {
  constructor (private readonly addSurveyRepository: IAddSurveyRepository) {
    this.addSurveyRepository = addSurveyRepository
  }

  async add (surveyData: IAddSurveyModel): Promise<void> {
    await this.addSurveyRepository.add(surveyData)
  }
}
