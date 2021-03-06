import { IController, IHttpRequest, IHttpResponse } from '../../presentation/protocols'
import { ILogErrorRepository } from '../../data/protocols/db/log/log-error-repository'

export class LogControllerDecorator implements IController {
  constructor (private readonly controller: IController,
    private readonly logErrorRepository: ILogErrorRepository) {
    this.controller = controller
    this.logErrorRepository = logErrorRepository
  }

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const httpResponse: IHttpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.logError(httpResponse.body.stack)
    }

    return httpResponse
  }
}
