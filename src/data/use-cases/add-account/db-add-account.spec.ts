import { DbAddAccount } from './db-add-account'
import { IEncrypter, IAddAccountModel, IAccountModel, IAddAccountRepository } from './db-add-account-protocols'

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

const makeEncrypter = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    async encrypt (password: string): Promise<string> {
      return await new Promise(resolve => resolve(hashedPassword))
    }
  }
  return new EncrypterStub()
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
  encrypterStub: IEncrypter
  addAccountRepositoryStub: IAddAccountRepository
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
  return { sut, encrypterStub, addAccountRepositoryStub }
}

describe('DB Add Account Use Case', () => {
  it('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    const accountData = makeFakeAddAccount()

    await sut.add(accountData)
    expect(encryptSpy).toBeCalledWith(password)
  })

  it('Should throw if encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockResolvedValueOnce(new Promise((resolve, reject) => reject(new Error())))

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
})
