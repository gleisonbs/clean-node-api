import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

let accountCollection: Collection
describe('Login Routes', () => {
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

  describe('POST /signup', () => {
    it('Should return 200 on signup', async () => {
      await request(app).post('/api/signup')
        .send({
          name: 'Test User',
          email: 'test.user@email.com',
          password: 'test.password',
          passwordConfirmation: 'test.password'
        })
        .expect(200)
    })
  })

  describe('POST /login', () => {
    it('Should return 200 on login', async () => {
      const email = 'test.user@email.com'
      const password = 'test.password'
      const hashedPassword = await hash(password, 12)

      accountCollection = await MongoHelper.getCollection('accounts')
      await accountCollection.insertOne({
        email,
        password: hashedPassword
      })

      await request(app).post('/api/login')
        .send({
          email,
          password
        })
        .expect(200)
    })
  })
})
