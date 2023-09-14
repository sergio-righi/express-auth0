import express, { Request, Response } from 'express';
import { TokenController } from '../controllers'
import { AuthMiddleware } from '../middlewares'

export class TokenRouter {
  router: express.Router;

  constructor() {
    this.router = express.Router()

    this.#setRoute();
  }

  #setRoute() {
    this.router.post('/', AuthMiddleware, (req: Request, res: Response) => TokenController.create(req, res))
    this.router.get('/', AuthMiddleware, (req: Request, res: Response) => TokenController.find(req, res))
    this.router.patch('/grant/:id', AuthMiddleware, (req: Request, res: Response) => TokenController.grant(req, res))
    this.router.patch('/revoke/:id', AuthMiddleware, (req: Request, res: Response) =>
      TokenController.revoke(req, res)
    )
    this.router.patch('/reset/:id', AuthMiddleware, (req: Request, res: Response) => TokenController.reset(req, res))
  }
}

export const TokenRouterInstance = new TokenRouter().router;