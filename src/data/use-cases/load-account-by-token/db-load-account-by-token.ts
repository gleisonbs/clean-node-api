import { ILoadAccountByToken } from '../../../domain/use-cases/load-account-by-token'
import { IAccountModel } from '../../../domain/models/account'
import { IDecrypter } from '../../protocols/criptography/decrypter'

export class DbLoadAccountByToken implements ILoadAccountByToken {
  constructor (private readonly decrypter: IDecrypter) {
    this.decrypter = decrypter
  }

  async load (accessToken: string, role?: string): Promise<IAccountModel | null> {
    await this.decrypter.decrypt(accessToken)
    return null
  }
}
