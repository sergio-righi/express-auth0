import express, { NextFunction, Request, Response } from 'express';
import passport from 'passport';

import { AuthControllerInstance } from 'controllers'
import { auth, jwt, provider } from 'middlewares'
import { env } from 'utils';

export class AuthRouter {
  router: express.Router;
  passportConfig: any = {
    session: false,
    userProperty: 'currentUser',
    failureRedirect: env.get('url.frontend')

  }

  constructor() {
    this.router = express.Router()

    this.#setRoute();
    this.#setProviderRoute();
  }

  #setRoute() {
    this.router.get("/fetch", jwt, (req: Request, res: Response) => AuthControllerInstance.fetch(req, res));
    this.router.get("/refresh-token", auth, (req: Request, res: Response) => AuthControllerInstance.refreshToken(req, res));
    this.router.post("/find", auth, (req: Request, res: Response) => AuthControllerInstance.find(req, res));
    this.router.post("/login", auth, (req: Request, res: Response) => AuthControllerInstance.login(req, res));
    this.router.post("/register", auth, (req: Request, res: Response) => AuthControllerInstance.register(req, res));
  }

  #setProviderRoute() {
    Object.keys(env.get('provider') || {}).forEach((providerName: string) => {
      // this.router.get(`/${providerName}`, (req: Request, res: Response, next: NextFunction) => provider(req, res, next, providerName))
      // this.router.get(`/${providerName}/callback`, (req: Request, res: Response, next: NextFunction) => provider(req, res, next, providerName), (req: Request, res: Response) =>
      //   AuthControllerInstance.generateUserTokenAndRedirect(req, res)
      // )

      this.router.get(`/${providerName}`, passport.authenticate(providerName, this.passportConfig));

      this.router.get(`/${providerName}/callback`,
        passport.authenticate(providerName, this.passportConfig),
        (req, res) => {
          AuthControllerInstance.generateUserTokenAndRedirect(req, res)
        });

    })
  }
}

export const AuthRouterInstance = new AuthRouter().router;