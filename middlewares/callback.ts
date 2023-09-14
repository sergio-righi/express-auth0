import { Request, Response, NextFunction } from 'express'

export function callback(req: Request, res: Response, next: NextFunction) {
  try {
    const callback = req.query.callback

    if (!callback) {
      const error: any = new Error('Callback URL was not provided.')
      error.statusCode = 401
      throw error
    }

    req['callback'] = callback;
    next();

  } catch (err) {
    err === 401 ? res.status(401) : res.end()
  }
}
