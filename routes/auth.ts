import express, { Request, Response } from 'express';
import { AuthController } from '../controllers'
import { AuthMiddleware, JWTMiddleware, ProviderMiddleware } from '../middlewares'
import { env } from '../utils';

class AuthRoute {
  router: express.Router;

  constructor() {
    this.router = express.Router()

    this.#setRoute();
    this.#setProviderRoute();
  }

  #setRoute() {
    this.router.get("/fetch", JWTMiddleware, (req, res) => AuthController.fetch(req, res));
    this.router.get("/refresh-token", AuthMiddleware, (req, res) => AuthController.refreshToken(req, res));
    this.router.post("/find", AuthMiddleware, (req, res) => AuthController.find(req, res));
    this.router.post("/login", AuthMiddleware, (req, res) => AuthController.login(req, res));
    this.router.post("/register", AuthMiddleware, (req, res) => AuthController.register(req, res));
  }

  #setProviderRoute() {
    Object.keys(env.get('provider') || {}).forEach((providerName: string) => {
      this.router.get(`/${providerName}`, ProviderMiddleware(providerName))
      this.router.get(`/${providerName}/callback`, ProviderMiddleware(providerName), (req, res) =>
        AuthController.generateUserTokenAndRedirect(req, res)
      )
    })
  }
}

export default new AuthRoute().router;