import { IController, IHttpRequest, IHttpResponse } from '../../presentation/protocols'

export class LogControllerDecorator implements IController {
  private readonly controller: IController

  constructor (controller: IController) {
    this.controller = controller
  }

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return await this.controller.handle(httpRequest)
  }
}