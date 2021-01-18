import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const valueToEncrypt = 'test.value'
const salt = 12

describe('Bcrypt Adapter', () => {
  it('Should call bcrypt with correct values', async () => {
    const sut = new BcryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt(valueToEncrypt)
    expect(hashSpy).toBeCalledWith(valueToEncrypt, 12)
  })
})
