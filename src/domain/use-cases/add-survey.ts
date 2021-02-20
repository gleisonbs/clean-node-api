import { ISurveyAnswerModel } from '../models/survey'

export interface IAddSurvey {
  add: (survey: IAddSurveyModel) => Promise<void>
}

export interface IAddSurveyModel {
  question: string
  answers: ISurveyAnswerModel[]
  date: Date
}
