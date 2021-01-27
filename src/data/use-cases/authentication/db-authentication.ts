import { ILoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { IAuthenticationModel } from '../../../domain/use-cases/authentication'
import { IHashComparer } from '../../protocols/criptography/hash-comparer'
import { ITokenGenerator } from '../../protocols/criptography/token-generator'

export class DbAuthentication {
  private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository
  private readonly hashComparer: IHashComparer
  private readonly tokenGenerator: ITokenGenerator

  constructor (loadAccountByEmailRepository: ILoadAccountByEmailRepository, hashComparer: IHashComparer, tokenGenerator: ITokenGenerator) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
  }

  async auth (authentication: IAuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)

    if (account) {
      const hashedPassword = account ? account.password : ''
      await this.hashComparer.compare(authentication.password, hashedPassword)

      const accountId = account ? account.id : ''
      await this.tokenGenerator.generate(accountId)
    }

    return null
  }
}
