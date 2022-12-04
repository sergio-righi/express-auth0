import express, { Request, Response } from 'express';
import { TokenController } from '../controllers'
import { AuthMiddleware } from '../middlewares'

class TokenRoute {
  router: express.Router;

  constructor() {
    this.router = express.Router()

    this.#setRoute();
  }

  #setRoute() {
    this.router.post('/', AuthMiddleware, (req, res) => TokenController.create(req, res))
    this.router.get('/', AuthMiddleware, (req, res) => TokenController.find(req, res))
    this.router.patch('/grant/:id', AuthMiddleware, (req, res) => TokenController.grant(req, res))
    this.router.patch('/revoke/:id', AuthMiddleware, (req, res) =>
      TokenController.revoke(req, res)
    )
    this.router.patch('/reset/:id', AuthMiddleware, (req, res) => TokenController.reset(req, res))
  }
}

export default new TokenRoute().router;