import { DbAddAccount } from './db-add-account'

const name = 'Test User'
const email = 'test.user@email.com'
const password = 'test.password'

class EncrypterStub {
  async encrypt (password: string): Promise<string> {
    return await new Promise(resolve => resolve(`hashed.${password}`))
  }
}

describe('DB Add Account Use Case', () => {
  it('Should call Encrypter with correct password', async () => {
    const encrypterStub = new EncrypterStub()
    const sut = new DbAddAccount(encrypterStub)
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
