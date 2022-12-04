import { Request, Response } from 'express'
import { env } from '../utils'

export default (req: any, res: Response, next: any) => {
  try {
    const apikey = req.headers.apikey

    if (!apikey) {
      const error: any = new Error('No parameters to authenticate.')
      error.statusCode = 401
      throw error
    }

    const secretKey = env.get('api')
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
