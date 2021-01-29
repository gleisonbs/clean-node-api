import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

const userId = 'test.user.id'
const secret = 'secret'

describe('JWT Adapter', () => {
  it('Should call sign with correct paramters', async () => {
    const sut = new JwtAdapter(secret)
    const signSpy = jest.spyOn(jwt, 'sign')

    await sut.encrypt(userId)
    expect(signSpy).toBeCalledWith({ id: userId }, secret)
  })
})
