import { ILoadAccountByEmailRepository, IAuthenticationModel, IHashComparer, IEncrypter, IUpdateAccessTokenRepository } from './db-authentication-protocols'

export class DbAuthentication {
  constructor (
    private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    private readonly hashComparer: IHashComparer,
    private readonly encrypter: IEncrypter,
    private readonly updateAccessTokenRepository: IUpdateAccessTokenRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.encrypter = encrypter
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth (authentication: IAuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email)

    if (account) {
      const hashedPassword = account ? account.password : ''
      const isValidPassword = await this.hashComparer.compare(authentication.password, hashedPassword)
      if (!isValidPassword) {
        return null
      }

      const accountId = account ? account.id : ''
      const accessToken = await this.encrypter.encrypt(accountId)
      await this.updateAccessTokenRepository.updateAccessToken(accountId, accessToken)
      return accessToken
    }

    return null
  }
}
