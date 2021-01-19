import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

describe('Account Mongo Repository', () => {
  const name: string = 'Test User'
  const email: string = 'test.user@email.com'
  const password: string = 'test.password'
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('Should return an account on success', async () => {
    const sut = new AccountMongoRepository()
    const account = await sut.add({ name, email, password })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(name)
    expect(account.email).toBe(email)
    expect(account.password).toBe(password)
  })
})
