import { DbAddAccount } from './db-add-account'
import { IHasher, IAddAccountModel, IAccountModel, IAddAccountRepository, ILoadAccountByEmailRepository } from './db-add-account-protocols'

const id = 'test.id'
const name = 'Test User'
const email = 'test.user@email.com'
const password = 'test.password'
const hashedPassword = 'test.hashed.password'

const makeFakeAddAccount = (): IAddAccountModel => ({
  name,
  email,
  password
})

const makeFakeAccount = (): IAccountModel => ({
  id,
  name,
  email,
  password: hashedPassword
})

const makeHasher = (): IHasher => {
  class HasherStub implements IHasher {
    async hash (password: string): Promise<string> {
      return await new Promise(resolve => resolve(hashedPassword))
    }
  }
  return new HasherStub()
}

const makeLoadAccountByEmailRepository = (): ILoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements ILoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<IAccountModel | null> {
      return null
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeAddAccountRepository = (): IAddAccountRepository => {
  class AddAccountRepositoryStub implements IAddAccountRepository {
    async add (account: IAddAccountModel): Promise<IAccountModel> {
      const fakeAccount = { id, name, email, password: hashedPassword }
      return await new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountRepositoryStub()
}

interface SutTypes {
  sut: DbAddAccount
  hasherStub: IHasher
  addAccountRepositoryStub: IAddAccountRepository
  loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
  return { sut, hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub }
}

describe('DB Add Account Use Case', () => {
  it('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')

    const accountData = makeFakeAddAccount()

    await sut.add(accountData)
    expect(hashSpy).toBeCalledWith(password)
  })

  it('Should throw if hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockResolvedValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const accountData = makeFakeAddAccount()

    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  it('Should call AddAccountRepository with correct parameters', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    const accountData = makeFakeAddAccount()

    await sut.add(accountData)
    expect(addSpy).toBeCalledWith({
      name, email, password: hashedPassword
    })
  })

  it('Should throw if addAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add')
      .mockResolvedValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const accountData = makeFakeAddAccount()

    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  it('Should return an account on success', async () => {
    const { sut } = makeSut()
    const accountData = makeFakeAddAccount()
    const account = await sut.add(accountData)
    expect(account).toEqual({
      id, name, email, password: hashedPassword
    })
  })

  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.add(makeFakeAddAccount())

    expect(loadSpy).toBeCalledWith(email)
  })

  it('Should return null if LoadAccountByEmailRepository returns not null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(makeFakeAccount())
    const account = await sut.add(makeFakeAddAccount())
    expect(account).toBeNull()
  })
})
