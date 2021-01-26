import { ok, badRequest, serverError, unauthorized } from '../../helpers/http/http-helper'
import { IController, IHttpRequest, IHttpResponse, IValidation, IAuthentication } from '../login/login-protocols'

export class LoginController implements IController {
  private readonly authentication: IAuthentication
  private readonly validation: IValidation

  constructor (authentication: IAuthentication, validation: IValidation) {
    this.validation = validation
    this.authentication = authentication
  }

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { email, password } = httpRequest.body
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const accessToken = await this.authentication.auth({ email, password })
      if (!accessToken) {
        return unauthorized()
      }

      return ok({ accessToken })
    } catch (err) {
      return serverError(err)
    }
  }
}
