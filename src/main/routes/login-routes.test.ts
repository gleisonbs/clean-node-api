import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
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
})
