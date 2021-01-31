import env from '../../config/env'
import { IController } from '../../../presentation/protocols'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { makeLoginValidation } from './login-validation-factory'
import { DbAuthentication } from '../../../data/use-cases/authentication/db-authentication'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'

export const makeLoginController = (): IController => {
  const loadAccountByEmailRepository = new AccountMongoRepository()
  const updateAccessTokenRepository = new AccountMongoRepository()
  const salt = 12
  const hashComparer = new BcryptAdapter(salt)
  const encrypter = new JwtAdapter(env.jwt_secret)
  const authentication = new DbAuthentication(loadAccountByEmailRepository, hashComparer, encrypter, updateAccessTokenRepository)
  const loginController = new LoginController(authentication, makeLoginValidation())
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logMongoRepository)
}
