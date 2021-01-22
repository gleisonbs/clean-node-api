import { LogControllerDecorator } from './log'
import { IHttpRequest, IController, IHttpResponse } from '../../presentation/protocols'
import { serverError } from '../../presentation/helpers/http-helper'
import { ILogErrorRepository } from '../../data/protocols/log-error-repository'

const makeLogErrorRepository = (): ILogErrorRepository => {
  class LogErrorRepositoryStub implements ILogErrorRepository {
    async log (message: string): Promise<void> {}
  }
  return new LogErrorRepositoryStub()
}

const makeController = (): IController => {
  class ControllerStub implements IController {
    async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
      const httpResponse: IHttpResponse = {
        statusCode: 200,
        body: {
          email: 'test.user@email.com',
          name: 'test user',
          password: 'test.hashed.password'
        }
      }
      return httpResponse
    }
  }
  return new ControllerStub()
}

interface SutTypes {
  sut: LogControllerDecorator
  controller: IController
  logErrorRepository: ILogErrorRepository
}

const makeSut = (): SutTypes => {
  const controller = makeController()
  const logErrorRepository = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controller, logErrorRepository)
  return { sut, controller, logErrorRepository }
}

describe('Log Controller Decorator', () => {
  it('Should call controller handle', async () => {
    const { sut, controller } = makeSut()
    const handleSpy = jest.spyOn(controller, 'handle')

    const httpRequest: IHttpRequest = {
      body: {
        email: 'test.user@email.com',
        name: 'test user',
        password: 'test.password',
        passwordConfirmation: 'test.password'
      }
    }

    await sut.handle(httpRequest)
    expect(handleSpy).toBeCalledWith(httpRequest)
  })

  it('Should return the same result of the controller', async () => {
    const { sut } = makeSut()

    const httpRequest: IHttpRequest = {
      body: {
        email: 'test.user@email.com',
        name: 'test user',
        password: 'test.password',
        passwordConfirmation: 'test.password'
      }
    }

    const httpResponse: IHttpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        email: 'test.user@email.com',
        name: 'test user',
        password: 'test.hashed.password'
      }
    })
  })

  it('Should call LogErrorRepository with correct error if cc', async () => {
    const { sut, controller, logErrorRepository } = makeSut()

    const fakeError = new Error()
    fakeError.stack = 'test.stack'
    const error = serverError(fakeError)

    jest.spyOn(controller, 'handle').mockResolvedValueOnce(error)
    const logSpy = jest.spyOn(logErrorRepository, 'log')

    const httpRequest: IHttpRequest = {
      body: {
        email: 'test.user@email.com',
        name: 'test user',
        password: 'test.password',
        passwordConfirmation: 'test.password'
      }
    }
    await sut.handle(httpRequest)
    expect(logSpy).toBeCalledWith(fakeError.stack)
  })
})
