export interface IAddSurvey {
  add: (survey: IAddSurveyModel) => Promise<void>
}

export interface IAddSurveyModel {
  question: string
  answers: ISurveyAnswer[]
}

interface ISurveyAnswer {
  image?: string
  answer: string
}
