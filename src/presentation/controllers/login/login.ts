import { IController } from '../../protocols/controller'
import { IHttpRequest, IHttpResponse } from '../../protocols'
import { ok, badRequest } from '../../helpers/http-helper'
import { MissingParamError, InvalidParamError } from '../../errors'
import { IEmailValidator } from '../signup/signup-protocols'

export class LoginController implements IController {
  private readonly emailValidator: IEmailValidator

  constructor (emailValidator: IEmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { email, password } = httpRequest.body
    if (!email) {
      return badRequest(new MissingParamError('email'))
    }

    if (!password) {
      return badRequest(new MissingParamError('password'))
    }

    const isValidEmail = this.emailValidator.isValid(email)
    if (!isValidEmail) {
      return badRequest(new InvalidParamError('email'))
    }

    return ok({})
  }
}
