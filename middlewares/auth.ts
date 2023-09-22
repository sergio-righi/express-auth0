import { env } from 'utils'
import { Request, Response, NextFunction } from 'express'

export function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const apikey = req.headers.authorization

    if (!apikey) {
      const error: any = new Error('No parameters to authenticate.')
      error.statusCode = 401
      throw error
    }

    const secretKey = String(env.get('api'));
    if (apikey === secretKey) next()
    else {
      const error: any = new Error('Not authenticated.')
      error.statusCode = 401
      throw error
    }
  } catch (err) {
    err === 401 ? res.status(401) : res.end()
  }
}
