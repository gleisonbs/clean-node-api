import { DbAddSurvey } from '../../../../../data/use-cases/add-survey/db-add-survey'
import { SurveyMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-mongo-repository'
import { IAddSurvey } from '../../../../../domain/use-cases/add-survey'

export const makeAddSurvey = (): IAddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbAddSurvey(surveyMongoRepository)
}
