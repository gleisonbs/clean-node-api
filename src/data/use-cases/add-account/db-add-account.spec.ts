import { DbAddAccount } from './db-add-account'
import { IEncrypter } from '../../protocols/encrypter'

const name = 'Test User'
const email = 'test.user@email.com'
const password = 'test.password'

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: IEncrypter
}
const makeEncrypter = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    async encrypt (password: string): Promise<string> {
      return await new Promise(resolve => resolve(`hashed.${password}`))
    }
  }
  return new EncrypterStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const sut = new DbAddAccount(encrypterStub)
  return { sut, encrypterStub }
}

describe('DB Add Account Use Case', () => {
  it('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    const accountData = {
      name,
      email,
      password
    }

    await sut.add(accountData)
    expect(encryptSpy).toBeCalledWith(password)
  })
})
