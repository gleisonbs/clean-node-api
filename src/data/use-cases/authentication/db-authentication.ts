import { ILoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { IAuthenticationModel } from '../../../domain/use-cases/authentication'

export class DbAuthentication {
  private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository

  constructor (loadAccountByEmailRepository: ILoadAccountByEmailRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async auth (authentication: IAuthenticationModel): Promise<string> {
    await this.loadAccountByEmailRepository.load(authentication.email)
    return null
  }
}
