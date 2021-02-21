import { SurveyMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-mongo-repository'
import { ILoadSurveys } from '../../../../../domain/use-cases/load-surveys'
import { DbLoadSurveys } from '../../../../../data/use-cases/load-surveys/db-load-surveys'

export const makeLoadSurveys = (): ILoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveys(surveyMongoRepository)
}
