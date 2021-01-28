import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'
import { IHasher } from '../../data/protocols/criptography/hasher'

const valueToHash = 'test.value'
const hashedValueExpected = 'test.hashed.value'

interface SutTypes {
  sut: IHasher
}

const salt = 12
const makeSut = (): SutTypes => {
  const sut = new BcryptAdapter(salt)
  return { sut }
}

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve(hashedValueExpected))
  }
}))

describe('Bcrypt Adapter', () => {
  it('Should call bcrypt with correct values', async () => {
    const { sut } = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.hash(valueToHash)
    expect(hashSpy).toBeCalledWith(valueToHash, salt)
  })

  it('Should return hashed value on success', async () => {
    const { sut } = makeSut()

    const hashedValue = await sut.hash(valueToHash)
    expect(hashedValue).toBe(hashedValueExpected)
  })

  it('Should throw if bcrypt throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'hash').mockRejectedValueOnce(new Error())

    const promise = sut.hash(valueToHash)
    await expect(promise).rejects.toThrow()
  })
})
