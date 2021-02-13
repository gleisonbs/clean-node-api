import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { Collection } from 'mongodb'

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

let surveyCollection: Collection
describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('Should add a survey on success', async () => {
    const sut = makeSut()
    await sut.add({
      question: 'test.question',
      answers: [{
        image: 'test.image',
        answer: 'test.answer'
      },
      {
        answer: 'test.answer.2'
      }]
    })

    const survey = await surveyCollection.findOne({
      question: 'test.question'
    })
    expect(survey).toBeTruthy()
  })
})
