import { Response } from 'express'

export class BaseController {
  handleError(res: Response, err: Error) {
    res.status(500).end()
  }
}
