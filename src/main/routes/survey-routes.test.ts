import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'

let surveyCollection: Collection
describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('survey')
    await surveyCollection.deleteMany({})
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
  })
})
