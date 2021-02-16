import { SignUpController } from '../../../../../presentation/controllers/login/signup/signup-controller'
import { IController } from '../../../../../presentation/protocols'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeAuthentication } from '../../../usecases/authentication/db-authentication-factory'
import { makeAddAccount } from '../../../usecases/account/add-account/db-add-account'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'

export const makeSignUpController = (): IController => {
  const controller = new SignUpController(makeAddAccount(), makeSignUpValidation(), makeAuthentication())
  return makeLogControllerDecorator(controller)
}
