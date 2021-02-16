import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'
import { Collection } from 'mongodb'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

let accountCollection: Collection
describe('Account Mongo Repository', () => {
  const name: string = 'Test User'
  const email: string = 'test.user@email.com'
  const password: string = 'test.password'
  const accessToken: string = 'test.token'
  const role: string = 'test.role'
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

  it('Should update the account accessToken on updateAccessToken success', async () => {
    const sut = makeSut()
    const res = await accountCollection.insertOne({ name, email, password })
    const fakeAccount = res.ops[0]

    expect(fakeAccount.accessToken).toBeFalsy()

    await sut.updateAccessToken(fakeAccount._id, 'test.token')

    const account = await accountCollection.findOne({ _id: fakeAccount._id })
    expect(account).toBeTruthy()
    expect(account?.accessToken).toBe('test.token')
  })

  it('Should return an account on loadByToken without role on success', async () => {
    const sut = makeSut()

    await accountCollection.insertOne({ name, email, password, accessToken })
    const account = await sut.loadByToken(accessToken)

    expect(account).toBeTruthy()
    expect(account?.id).toBeTruthy()
    expect(account?.name).toBe(name)
    expect(account?.email).toBe(email)
    expect(account?.password).toBe(password)
  })

  it('Should return an account on loadByToken with role on success', async () => {
    const sut = makeSut()

    await accountCollection.insertOne({ name, email, password, accessToken, role })
    const account = await sut.loadByToken(accessToken, role)

    expect(account).toBeTruthy()
    expect(account?.id).toBeTruthy()
    expect(account?.name).toBe(name)
    expect(account?.email).toBe(email)
    expect(account?.password).toBe(password)
  })

  it('Should return null if loadByToken fails', async () => {
    const sut = makeSut()
    const account = await sut.loadByToken(accessToken)
    expect(account).toBeFalsy()
  })
})
