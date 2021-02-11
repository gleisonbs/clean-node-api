import { IController, IHttpRequest, IHttpResponse, IValidation } from './add-survey-controller-protocols'
import { ok, badRequest } from '../../../helpers/http/http-helper'

export class AddSurveyController implements IController {
  constructor (private readonly validation: IValidation) {
    this.validation = validation
  }

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const error = this.validation.validate(httpRequest.body)
    if (error) {
      return badRequest(error)
    }
    return ok({})
  }
}
