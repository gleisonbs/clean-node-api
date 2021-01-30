import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'
import { Collection } from 'mongodb'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

let accountCollection: Collection
describe('Account Mongo Repository', () => {
  const name: string = 'Test User'
  const email: string = 'test.user@email.com'
  const password: string = 'test.password'
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('Should return an account on add success', async () => {
    const sut = makeSut()
    const account = await sut.add({ name, email, password })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(name)
    expect(account.email).toBe(email)
    expect(account.password).toBe(password)
  })

  it('Should return an account on loadByEmail success', async () => {
    const sut = makeSut()

    await accountCollection.insertOne({ name, email, password })
    const account = await sut.loadByEmail(email)

    expect(account).toBeTruthy()
    expect(account?.id).toBeTruthy()
    expect(account?.name).toBe(name)
    expect(account?.email).toBe(email)
    expect(account?.password).toBe(password)
  })

  it('Should return an null on loadByEmail failure', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail(email)
    expect(account).toBeFalsy()
  })
})
