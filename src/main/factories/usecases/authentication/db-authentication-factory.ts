import env from '../../../config/env'
import { DbAuthentication } from '../../../../data/use-cases/authentication/db-authentication'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../../infra/criptography/jwt-adapter/jwt-adapter'
import { IAuthentication } from '../../../../domain/use-cases/authentication'

export const makeAuthentication = (): IAuthentication => {
  const loadAccountByEmailRepository = new AccountMongoRepository()
  const updateAccessTokenRepository = new AccountMongoRepository()
  const salt = 12
  const hashComparer = new BcryptAdapter(salt)
  const encrypter = new JwtAdapter(env.jwt_secret)
  return new DbAuthentication(loadAccountByEmailRepository, hashComparer, encrypter, updateAccessTokenRepository)
}
