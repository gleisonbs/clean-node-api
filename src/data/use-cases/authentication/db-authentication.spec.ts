import { IAccountModel } from '../../../domain/models/account'
import { ILoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'
import { IAuthenticationModel } from '../../../domain/use-cases/authentication'

const id = 'test.id'
const name = 'test.name'
const email = 'test.user@email.com'
const password = 'test.password'

const makeFakeAccount = (): IAccountModel => {
  return {
    id,
    name,
    email,
    password
  }
}

const makeFakeAuthentication = (): IAuthenticationModel => {
  return {
    email,
    password
  }
}

const makeLoadAccountByEmailRepository = (): ILoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements ILoadAccountByEmailRepository {
    async load (email: string): Promise<IAccountModel> {
      return makeFakeAccount()
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepository: ILoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepository = makeLoadAccountByEmailRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepository)
  return { sut, loadAccountByEmailRepository }
}

describe('DbAuthentication UseCase', () => {
  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')
    await sut.auth(makeFakeAuthentication())

    expect(loadSpy).toBeCalledWith(email)
  })

  it('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    jest.spyOn(loadAccountByEmailRepository, 'load').mockRejectedValueOnce(new Error())

    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow()
  })
})
