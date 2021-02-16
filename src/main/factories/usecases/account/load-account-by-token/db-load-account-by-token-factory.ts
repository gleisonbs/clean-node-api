import { DbLoadAccountByToken } from '../../../../../data/use-cases/load-account-by-token/db-load-account-by-token'
import { AccountMongoRepository } from '../../../../../infra/db/mongodb/account/account-mongo-repository'
import { ILoadAccountByToken } from '../../../../../domain/use-cases/load-account-by-token'
import { JwtAdapter } from '../../../../../infra/criptography/jwt-adapter/jwt-adapter'
import env from '../../../../config/env'

export const makeDbLoadAccountByToken = (): ILoadAccountByToken => {
  const decrypter = new JwtAdapter(env.jwt_secret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbLoadAccountByToken(decrypter, accountMongoRepository)
}
