import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { Collection } from 'mongodb'
import { IAddSurveyModel } from '../../../../domain/use-cases/add-survey'

const date = new Date()
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
      }],
      date
    })

    const survey = await surveyCollection.findOne({
      question: 'test.question'
    })
    expect(survey).toBeTruthy()
  })

  const makeFakeSurvey = (): IAddSurveyModel => ({
    question: 'test.question',
    answers: [
      {
        image: 'test.image',
        answer: 'test.answer'
      },
      {
        answer: 'test.answer.2'
      }
    ],
    date
  })

  it('Should load all surveys on success', async () => {
    const sut = makeSut()
    await surveyCollection.insertMany([
      makeFakeSurvey(), makeFakeSurvey()
    ])

    const surveys = await sut.loadAll()
    expect(surveys.length).toBe(2)
  })
})
