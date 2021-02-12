import { IAddSurveyModel } from '../../../../domain/use-cases/add-survey'

export interface IAddSurveyRepository {
  add: (surveyData: IAddSurveyModel) => Promise<void>
}
