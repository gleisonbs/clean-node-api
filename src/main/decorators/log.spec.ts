import { LogControllerDecorator } from './log'
import { IHttpRequest, IController, IHttpResponse } from '../../presentation/protocols'
import { ok, serverError } from '../../presentation/helpers/http-helper'
import { ILogErrorRepository } from '../../data/protocols/log-error-repository'
import { IAccountModel } from '../../domain/models/account'

const name = 'Test User'
const id = 'test.id'
const email = 'test.user@email.com'
const password = 'test.password'
const errorStack = 'test.stack'

const makeFakeServerError = (): IHttpResponse => {
  const fakeError = new Error()
  fakeError.stack = errorStack
  return serverError(fakeError)
}

const makeFakeAccount = (): IAccountModel => ({
  id,
  email,
  name,
  password: 'test.hashed.password'
})

const makeHttpRequest = (): IHttpRequest => {
  return {
    body: {
      email,
      name,
      password,
      passwordConfirmation: password
    }
  }
}

const makeLogErrorRepository = (): ILogErrorRepository => {
  class LogErrorRepositoryStub implements ILogErrorRepository {
    async logError (message: string): Promise<void> { }
  }
  return new LogErrorRepositoryStub()
}

const makeController = (): IController => {
  class ControllerStub implements IController {
    async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
      return ok(makeFakeAccount())
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

    const httpRequest: IHttpRequest = makeHttpRequest()

    await sut.handle(httpRequest)
    expect(handleSpy).toBeCalledWith(httpRequest)
  })

  it('Should return the same result of the controller', async () => {
    const { sut } = makeSut()

    const httpResponse: IHttpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  it('Should call LogErrorRepository with correct error if controller throws', async () => {
    const { sut, controller, logErrorRepository } = makeSut()

    const error = makeFakeServerError()

    jest.spyOn(controller, 'handle').mockResolvedValueOnce(error)
    const logSpy = jest.spyOn(logErrorRepository, 'logError')

    await sut.handle(makeHttpRequest())
    expect(logSpy).toBeCalledWith(errorStack)
  })
})
