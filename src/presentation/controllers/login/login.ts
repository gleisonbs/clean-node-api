import { IController } from '../../protocols/controller'
import { IHttpRequest, IHttpResponse } from '../../protocols'
import { ok, badRequest } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors'
import { IEmailValidator } from '../signup/signup-protocols'

export class LoginController implements IController {
  private readonly emailValidator: IEmailValidator

  constructor (emailValidator: IEmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'))
    }

    if (!httpRequest.body.password) {
      return badRequest(new MissingParamError('password'))
    }

    const { email } = httpRequest.body
    this.emailValidator.isValid(email)

    return ok({})
  }
}
