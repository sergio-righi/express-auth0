import express, { Request, Response } from 'express';
import { TokenControllerInstance } from 'controllers'
import { auth } from 'middlewares'

export class TokenRouter {
  router: express.Router;

  constructor() {
    this.router = express.Router()

    this.#setRoute();
  }

  #setRoute() {
    this.router.post('/', auth, (req: Request, res: Response) => TokenControllerInstance.create(req, res))
    this.router.get('/', auth, (req: Request, res: Response) => TokenControllerInstance.find(req, res))
    this.router.patch('/grant/:id', auth, (req: Request, res: Response) => TokenControllerInstance.grant(req, res))
    this.router.patch('/revoke/:id', auth, (req: Request, res: Response) =>
      TokenControllerInstance.revoke(req, res)
    )
    this.router.patch('/reset/:id', auth, (req: Request, res: Response) => TokenControllerInstance.reset(req, res))
  }
}

export const TokenRouterInstance = new TokenRouter().router;