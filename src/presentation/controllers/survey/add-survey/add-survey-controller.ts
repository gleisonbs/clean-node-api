import { IController, IHttpRequest, IHttpResponse, IValidation } from './add-survey-controller-protocols'
import { ok, badRequest, serverError } from '../../../helpers/http/http-helper'
import { IAddSurvey } from '../../../../domain/use-cases/add-survey'

export class AddSurveyController implements IController {
  constructor (private readonly validation: IValidation,
    private readonly addSurvey: IAddSurvey) {
    this.validation = validation
    this.addSurvey = addSurvey
  }

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { question, answers } = httpRequest.body
      await this.addSurvey.add({
        question,
        answers
      })
      return ok({})
    } catch (err) {
      return serverError(err)
    }
  }
}
