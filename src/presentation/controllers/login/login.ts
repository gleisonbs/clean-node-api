import { IController } from '../../protocols/controller'
import { IHttpRequest, IHttpResponse } from '../../protocols'
import { ok, badRequest, serverError } from '../../helpers/http-helper'
import { MissingParamError, InvalidParamError } from '../../errors'
import { IEmailValidator } from '../signup/signup-protocols'
import { IAuthentication } from '../../../domain/use-cases/authentication'

export class LoginController implements IController {
  private readonly emailValidator: IEmailValidator
  private readonly authentication: IAuthentication

  constructor (emailValidator: IEmailValidator, authentication: IAuthentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
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

      await this.authentication.auth(email, password)

      return ok({})
    } catch (err) {
      return serverError(err)
    }
  }
}
