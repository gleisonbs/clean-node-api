import { IHttpRequest, IHttpResponse } from '../protocols/http'

export interface IMiddleware {
  handle: (httpRequest: IHttpRequest) => Promise<IHttpResponse>
}
