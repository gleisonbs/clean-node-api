import { IController, IHttpRequest, IHttpResponse } from './load-surveys-controller-protocols'
import { ILoadSurveys } from '../../../../domain/use-cases/load-surveys'
import { ok } from '../../../helpers/http/http-helper'

export class LoadSurveysController implements IController {
  constructor (private readonly loadSurveys: ILoadSurveys) {
    this.loadSurveys = loadSurveys
  }

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    await this.loadSurveys.load()
    return ok({})
  }
}
