import { Request, Response } from 'express'
import { IController } from '../../presentation/protocols/controller'
import { IHttpRequest, IHttpResponse } from '../../presentation/protocols'

export const adaptRoute = (controller: IController) => {
  return (req: Request, res: Response): void => {
    const httpRequest: IHttpRequest = {
      body: req.body
    }

    controller.handle(httpRequest)
      .then((httpResponse: IHttpResponse) => {
        if (httpResponse.statusCode === 200) {
          res.status(httpResponse.statusCode).json(httpResponse.body)
        } else {
          res.status(httpResponse.statusCode).json({ error: httpResponse.body.message })
        }
      }
      )
      .catch(err => console.error(err))
  }
}
