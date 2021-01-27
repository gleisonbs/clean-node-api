import { ILoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { IAuthenticationModel } from '../../../domain/use-cases/authentication'
import { IHashComparer } from '../../protocols/criptography/hash-comparer'
import { ITokenGenerator } from '../../protocols/criptography/token-generator'
import { IUpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository'

export class DbAuthentication {
  private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository
  private readonly hashComparer: IHashComparer
  private readonly tokenGenerator: ITokenGenerator
  private readonly updateAccessTokenRepository: IUpdateAccessTokenRepository

  constructor (
    loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    hashComparer: IHashComparer,
    tokenGenerator: ITokenGenerator,
    updateAccessTokenRepository: IUpdateAccessTokenRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth (authentication: IAuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)

    if (account) {
      const hashedPassword = account ? account.password : ''
      const isValidPassword = await this.hashComparer.compare(authentication.password, hashedPassword)
      if (!isValidPassword) {
        return null
      }

      const accountId = account ? account.id : ''
      const accessToken = await this.tokenGenerator.generate(accountId)
      await this.updateAccessTokenRepository.update(accountId, accessToken)
      return accessToken
    }

    return null
  }
}
