import { ILoadAccountByToken } from '../../../domain/use-cases/load-account-by-token'
import { IAccountModel } from '../../../domain/models/account'
import { IDecrypter } from '../../protocols/criptography/decrypter'
import { ILoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'

export class DbLoadAccountByToken implements ILoadAccountByToken {
  constructor (
    private readonly decrypter: IDecrypter,
    private readonly loadAccountByTokenRepository: ILoadAccountByTokenRepository) {
    this.decrypter = decrypter
    this.loadAccountByTokenRepository = loadAccountByTokenRepository
  }

  async load (accessToken: string, role?: string): Promise<IAccountModel | null> {
    const token = await this.decrypter.decrypt(accessToken)
    if (token) {
      await this.loadAccountByTokenRepository.loadByToken(token, role)
    }
    return null
  }
}
