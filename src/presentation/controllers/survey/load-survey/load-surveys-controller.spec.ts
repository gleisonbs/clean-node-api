import { LoadSurveysController } from './load-surveys-controller'
import { ISurveyModel, ILoadSurveys } from './load-surveys-controller-protocols'

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

describe('LoadSurveys Controller', () => {
  it('Should call LoadSurveys', async () => {
    class LoadSurveysStub implements ILoadSurveys {
      async load (): Promise<ISurveyModel[] | null> {
        return makeFakeSurveys()
      }
    }

    const loadSurveysStub = new LoadSurveysStub()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    const sut = new LoadSurveysController(loadSurveysStub)
    await sut.handle({})
    expect(loadSpy).toBeCalled()
  })
})
