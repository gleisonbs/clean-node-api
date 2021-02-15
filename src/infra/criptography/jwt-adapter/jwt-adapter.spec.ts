import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

const userId = 'test.user.id'
const secret = 'secret'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return 'test.accessToken'
  },
  async verify (): Promise<string> {
    return 'test.decrypted.token'
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('JWT Adapter', () => {
  describe('sign()', () => {
    it('Should call sign with correct parameters', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')

      await sut.encrypt(userId)
      expect(signSpy).toBeCalledWith({ id: userId }, secret)
    })

    it('Should return a token on sign success', async () => {
      const sut = makeSut()

      const accessToken = await sut.encrypt(userId)
      expect(accessToken).toBeTruthy()
    })

    it('Should throw sign throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error() })

      const promise = sut.encrypt(userId)
      await expect(promise).rejects.toThrow()
    })
  })

  describe('verify', () => {
    it('Should call verify with correct parameters', async () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')

      await sut.decrypt('test.token')
      expect(verifySpy).toBeCalledWith('test.token', secret)
    })

    it('Should return a value on verify success', async () => {
      const sut = makeSut()

      const value = await sut.decrypt('test.token')
      expect(value).toBe('test.decrypted.token')
    })

    it('Should throw if verify throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => { throw new Error() })

      const promise = sut.decrypt('test.token')
      await expect(promise).rejects.toThrow()
    })
  })
})
