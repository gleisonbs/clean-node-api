import { ok, badRequest, serverError, unauthorized } from '../../helpers/http-helper'
import { MissingParamError, InvalidParamError } from '../../errors'
import { IController, IHttpRequest, IHttpResponse, IEmailValidator, IAuthentication } from '../login/login-protocols'

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

      const accessToken = await this.authentication.auth(email, password)
      if (!accessToken) {
        return unauthorized()
      }

      return ok({ accessToken })
    } catch (err) {
      return serverError(err)
    }
  }
}
