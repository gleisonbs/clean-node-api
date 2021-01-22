import { LogControllerDecorator } from './log'
import { IHttpRequest, IController, IHttpResponse } from '../../presentation/protocols'

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

describe('Log Controller Decorator', () => {
  it('Should call controller handle', async () => {
    const controller = new ControllerStub()
    const handleSpy = jest.spyOn(controller, 'handle')

    const sut = new LogControllerDecorator(controller)

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
})
