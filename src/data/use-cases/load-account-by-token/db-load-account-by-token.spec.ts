import { IDecrypter } from '../../protocols/criptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { IAccountModel } from '../../../domain/models/account'
import { ILoadAccountByTokenRepository } from '../../../data/protocols/db/account/load-account-by-token-repository'

const id = 'test.id'
const name = 'Test User'
const email = 'test.user@email.com'
const hashedPassword = 'test.hashed.password'
const decryptedToken = 'test.decrypted.token'

const makeFakeAccount = (): IAccountModel => ({
  id,
  name,
  email,
  password: hashedPassword
})

const makeLoadAccountByTokenRepository = (): ILoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements ILoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<IAccountModel | null> {
      return makeFakeAccount()
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

const makeDecrypter = (): IDecrypter => {
  class DecrypterStub implements IDecrypter {
    async decrypt (value: string): Promise<string> {
      return decryptedToken
    }
  }
  return new DecrypterStub()
}

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: IDecrypter
  loadAccountByTokenRepositoryStub: ILoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter()
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository()
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)
  return { sut, decrypterStub, loadAccountByTokenRepositoryStub }
}

describe('DbLoadAccountByToken UseCase', () => {
  it('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')

    await sut.load('test.token', 'test.role')
    expect(decryptSpy).toBeCalledWith('test.token')
  })

  it('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null)

    const accountResult = await sut.load('test.token')
    expect(accountResult).toBe(null)
  })

  it('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')

    await sut.load('test.token', 'test.role')
    expect(loadByTokenSpy).toBeCalledWith(decryptedToken, 'test.role')
  })

  it('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockResolvedValueOnce(null)

    const accountResult = await sut.load('test.token', 'test.role')
    expect(accountResult).toBe(null)
  })

  it('Should return an account on success', async () => {
    const { sut } = makeSut()

    const accountResult = await sut.load('test.token', 'test.role')
    expect(accountResult).toEqual(makeFakeAccount())
  })

  it('Should throw if decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockRejectedValueOnce(new Error())

    const promise = sut.load('test.token', 'test.role')
    await expect(promise).rejects.toThrow()
  })

  it('Should throw if loadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockRejectedValueOnce(new Error())

    const promise = sut.load('test.token', 'test.role')
    await expect(promise).rejects.toThrow()
  })
})
