import { LoadSurveysController } from './load-surveys-controller'
import { ISurveyModel, ILoadSurveys } from './load-surveys-controller-protocols'
import { ok } from '../../../helpers/http/http-helper'

const date = new Date()
const makeFakeSurveys = (): ISurveyModel[] => ([{
  id: 'test.id',
  question: 'test.question',
  answers: [
    { image: 'test.image', answer: 'test.answer' }
  ],
  date
}, {
  id: 'test.id',
  question: 'test.question',
  answers: [
    { image: 'test.image', answer: 'test.answer' }
  ],
  date
}])

interface SutTypes {
  loadSurveysStub: ILoadSurveys
  sut: LoadSurveysController
}

const makeLoadSurveysStub = (): ILoadSurveys => {
  class LoadSurveysStub implements ILoadSurveys {
    async load (): Promise<ISurveyModel[] | null> {
      return makeFakeSurveys()
    }
  }

  return new LoadSurveysStub()
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveysStub()
  const sut = new LoadSurveysController(loadSurveysStub)
  return { sut, loadSurveysStub }
}

describe('LoadSurveys Controller', () => {
  it('Should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle({})
    expect(loadSpy).toBeCalled()
  })

  it('Should call LoadSurveys', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok(makeFakeSurveys()))
  })
})
