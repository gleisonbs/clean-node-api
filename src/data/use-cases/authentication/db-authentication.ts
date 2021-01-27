import { ILoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { IAuthenticationModel } from '../../../domain/use-cases/authentication'
import { IHashComparer } from '../../protocols/criptography/hash-comparer'

export class DbAuthentication {
  private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository
  private readonly hashComparer: IHashComparer

  constructor (loadAccountByEmailRepository: ILoadAccountByEmailRepository, hashComparer: IHashComparer) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
  }

  async auth (authentication: IAuthenticationModel): Promise<string|null> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)

    const hashedPassword = account ? account.password : ''
    await this.hashComparer.compare(authentication.password, hashedPassword)

    return null
  }
}
