import { IAccountModel } from '../../../domain/models/account'
import { ILoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'

const id = 'test.id'
const name = 'test.name'
const email = 'test.user@email.com'
const password = 'test.password'

class LoadAccountByEmailRepositoryStub implements ILoadAccountByEmailRepository {
  async load (email: string): Promise<IAccountModel> {
    return {
      id,
      name,
      email,
      password
    }
  }
}

describe('DbAuthentication UseCase', () => {
  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth({
      email,
      password
    })

    expect(loadSpy).toBeCalledWith(email)
  })
})
