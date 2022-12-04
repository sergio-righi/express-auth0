import express, { Request, Response } from 'express';
import { MailController } from '../controllers'
import { AuthMiddleware } from '../middlewares'

class MailRoute {
  router: express.Router;

  constructor() {
    this.router = express.Router()

    this.#setRoute();
  }

  #setRoute() {
    this.router.post('/verification-code', AuthMiddleware, (req, res) =>
      MailController.verificationCode(req, res)
    )
    this.router.post('/forget-password', AuthMiddleware, (req, res) =>
      MailController.forgetPassword(req, res)
    )
  }
}

export default new MailRoute().router;