import { ISurveyModel } from '../../../../domain/models/survey'

export interface ILoadSurveyRepository {
  loadAll: () => Promise<ISurveyModel[]>
}
