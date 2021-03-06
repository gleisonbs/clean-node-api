import { IAccountModel, ILoadAccountByEmailRepository, IAuthenticationModel, IHashComparer, IEncrypter, IUpdateAccessTokenRepository } from './db-authentication-protocols'
import { DbAuthentication } from './db-authentication'

const id = 'test.id'
const name = 'test.name'
const email = 'test.user@email.com'
const password = 'test.password'
const token = 'test.token'

const makeFakeAccount = (): IAccountModel => {
  return {
    id,
    name,
    email,
    password: 'test.hashed.password'
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
    async loadByEmail (email: string): Promise<IAccountModel | null> {
      return makeFakeAccount()
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparer = (): IHashComparer => {
  class HashComparerStub implements IHashComparer {
    async compare (value: string, hashedValue: string): Promise<boolean> {
      return true
    }
  }
  return new HashComparerStub()
}

const makeEncrypter = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    async encrypt (id: string): Promise<string> {
      return token
    }
  }
  return new EncrypterStub()
}

const makeUpdateAccessTokenRepository = (): IUpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements IUpdateAccessTokenRepository {
    async updateAccessToken (id: string, token: string): Promise<void> { }
  }
  return new UpdateAccessTokenRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepository: ILoadAccountByEmailRepository
  hashComparer: IHashComparer
  encrypter: IEncrypter
  updateAccessTokenRepository: IUpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepository = makeLoadAccountByEmailRepository()
  const hashComparer = makeHashComparer()
  const encrypter = makeEncrypter()
  const updateAccessTokenRepository = makeUpdateAccessTokenRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepository, hashComparer, encrypter, updateAccessTokenRepository)
  return { sut, loadAccountByEmailRepository, hashComparer, encrypter, updateAccessTokenRepository }
}

describe('DbAuthentication UseCase', () => {
  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'loadByEmail')
    await sut.auth(makeFakeAuthentication())

    expect(loadSpy).toBeCalledWith(email)
  })

  it('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    jest.spyOn(loadAccountByEmailRepository, 'loadByEmail').mockRejectedValueOnce(new Error())

    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow()
  })

  it('Should return null LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    jest.spyOn(loadAccountByEmailRepository, 'loadByEmail').mockResolvedValueOnce(null)

    const accessToken = await sut.auth(makeFakeAuthentication())

    expect(accessToken).toBeNull()
  })

  it('Should call HashComparer with correct values', async () => {
    const { sut, hashComparer } = makeSut()
    const compareSpy = jest.spyOn(hashComparer, 'compare')
    await sut.auth(makeFakeAuthentication())

    expect(compareSpy).toBeCalledWith(password, 'test.hashed.password')
  })

  it('Should throw if HashComparer throws', async () => {
    const { sut, hashComparer } = makeSut()
    jest.spyOn(hashComparer, 'compare').mockRejectedValueOnce(new Error())

    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow()
  })

  it('Should return null HashComparer returns false', async () => {
    const { sut, hashComparer } = makeSut()
    jest.spyOn(hashComparer, 'compare').mockResolvedValueOnce(false)

    const accessToken = await sut.auth(makeFakeAuthentication())

    expect(accessToken).toBeNull()
  })

  it('Should call Encrypter with correct id', async () => {
    const { sut, encrypter } = makeSut()
    const encryptSpy = jest.spyOn(encrypter, 'encrypt')
    await sut.auth(makeFakeAuthentication())

    expect(encryptSpy).toBeCalledWith(id)
  })

  it('Should throw if Encrypter throws', async () => {
    const { sut, encrypter } = makeSut()
    jest.spyOn(encrypter, 'encrypt').mockRejectedValueOnce(new Error())

    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow()
  })

  it('Should return token on success', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBe(token)
  })

  it('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepository } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepository, 'updateAccessToken')
    await sut.auth(makeFakeAuthentication())

    expect(updateSpy).toBeCalledWith(id, token)
  })

  it('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepository } = makeSut()
    jest.spyOn(updateAccessTokenRepository, 'updateAccessToken').mockRejectedValueOnce(new Error())

    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow()
  })
})
