import { IController } from '../../protocols/controller'
import { IHttpRequest, IHttpResponse } from '../../protocols'
import { ok, badRequest } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors'

export class LoginController implements IController {
  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'))
    }

    if (!httpRequest.body.password) {
      return badRequest(new MissingParamError('password'))
    }

    return ok({})
  }
}
