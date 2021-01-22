import { LogControllerDecorator } from './log'
import { IHttpRequest, IController, IHttpResponse } from '../../presentation/protocols'

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
}

const makeSut = (): SutTypes => {
  const controller = makeController()
  const sut = new LogControllerDecorator(controller)
  return { sut, controller }
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
})
