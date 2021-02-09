import { badRequest, serverError, ok } from '../../helpers/http/http-helper'
import { IAddAccount, IController, IHttpRequest, IHttpResponse, IAuthentication } from './signup-controller-protocols'
import { IValidation } from '../../protocols/validation'

export class SignUpController implements IController {
  constructor (private readonly addAccount: IAddAccount,
    private readonly validation: IValidation,
    private readonly authentication: IAuthentication) {
    this.addAccount = addAccount
    this.validation = validation
    this.authentication = authentication
  }

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = httpRequest.body
      const account = await this.addAccount.add({ name, email, password })

      await this.authentication.auth({
        email, password
      })

      return ok(account)
    } catch (err) {
      return serverError(err)
    }
  }
}
