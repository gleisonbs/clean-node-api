import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const valueToHash = 'test.value'
const hashedValueExpected = 'test.hashed.value'

const salt = 12
const makeSut = (): BcryptAdapter => {
  const sut = new BcryptAdapter(salt)
  return sut
}

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return hashedValueExpected
  },
  async compare (value: string, hashedValue: string): Promise<boolean> {
    return true
  }
}))

describe('Bcrypt Adapter', () => {
  it('Should call bcrypt hash with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.hash(valueToHash)
    expect(hashSpy).toBeCalledWith(valueToHash, salt)
  })

  it('Should return a valid hash on hash success', async () => {
    const sut = makeSut()

    const hashedValue = await sut.hash(valueToHash)
    expect(hashedValue).toBe(hashedValueExpected)
  })

  it('Should throw if bcrypt throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockRejectedValueOnce(new Error())

    const promise = sut.hash(valueToHash)
    await expect(promise).rejects.toThrow()
  })

  it('Should call bcrypt compare with correct values', async () => {
    const sut = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')

    await sut.compare(valueToHash, hashedValueExpected)
    expect(compareSpy).toBeCalledWith(valueToHash, hashedValueExpected)
  })

  it('Should return true when compare succeeds', async () => {
    const sut = makeSut()

    const isValid = await sut.compare(valueToHash, hashedValueExpected)
    expect(isValid).toBe(true)
  })
})
