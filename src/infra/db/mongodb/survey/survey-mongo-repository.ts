import { IAddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository'
import { IAddSurveyModel } from '../../../../domain/use-cases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'
import { ISurveyModel } from '../../../../domain/models/survey'

export class SurveyMongoRepository implements IAddSurveyRepository {
  async add (surveyData: IAddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<ISurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys: ISurveyModel[] = await surveyCollection.find().toArray()
    return surveys
  }
}
