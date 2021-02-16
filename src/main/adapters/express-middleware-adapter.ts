import { Request, Response, NextFunction } from 'express'
import { IHttpRequest, IHttpResponse, IMiddleware } from '../../presentation/protocols'

export const adaptMiddleware = (middleware: IMiddleware) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const httpRequest: IHttpRequest = {
      headers: req.headers
    }

    middleware.handle(httpRequest)
      .then((httpResponse: IHttpResponse) => {
        if (httpResponse.statusCode === 200) {
          Object.assign(req, httpResponse.body)
          next()
        } else {
          res.status(httpResponse.statusCode).json({ error: httpResponse.body.message })
        }
      }
      )
      .catch(err => console.error(err))
  }
}
