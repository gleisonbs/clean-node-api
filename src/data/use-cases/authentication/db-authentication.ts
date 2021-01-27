import { IAccountModel } from '../../../domain/models/account'
import { ILoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { IAuthenticationModel } from '../../../domain/use-cases/authentication'

export class DbAuthentication {
  private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository

  constructor (loadAccountByEmailRepository: ILoadAccountByEmailRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async auth (authentication: IAuthenticationModel): Promise<IAccountModel> {
    await this.loadAccountByEmailRepository.load(authentication.email)
    return {
      id: '',
      name: '',
      email: '',
      password: ''
    }
  }
}
