import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection
describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('survey')
    await surveyCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('POST /surveys', () => {
    it('Should return 403 on add survey without token', async () => {
      await request(app).post('/api/surveys')
        .send({
          question: 'test.question',
          answers: [
            {
              image: 'http://test.image',
              answer: 'test.answer'
            },
            {
              answer: 'test.answer'
            }
          ]
        })
        .expect(403)
    })

    it('Should return 204 on add survey with valid token', async () => {
      accountCollection = await MongoHelper.getCollection('accounts')

      const res = await accountCollection.insertOne({
        name: 'test.user',
        email: 'test.user@email.com',
        password: '123',
        role: 'admin'
      })

      const id = res.ops[0]._id
      const accessToken = sign({ id }, env.jwt_secret)

      await accountCollection.updateOne({
        _id: id
      }, {
        $set: {
          accessToken
        }
      })

      await request(app).post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'test.question',
          answers: [
            {
              image: 'http://test.image',
              answer: 'test.answer'
            },
            {
              answer: 'test.answer'
            }
          ]
        })
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    it('Should return 403 on load surveys without token', async () => {
      await request(app).get('/api/surveys')
        .send()
        .expect(403)
    })
  })
})
