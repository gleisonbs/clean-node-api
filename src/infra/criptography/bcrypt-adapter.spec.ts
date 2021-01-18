import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const valueToEncrypt = 'test.value'
const hashedValueExpected = 'test.hashed.value'
const salt = 12

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve(hashedValueExpected))
  }
}))

describe('Bcrypt Adapter', () => {
  it('Should call bcrypt with correct values', async () => {
    const sut = new BcryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt(valueToEncrypt)
    expect(hashSpy).toBeCalledWith(valueToEncrypt, 12)
  })

  it('Should return hashed value on success', async () => {
    const sut = new BcryptAdapter(salt)

    const hashedValue = await sut.encrypt(valueToEncrypt)
    expect(hashedValue).toBe(hashedValueExpected)
  })
})
