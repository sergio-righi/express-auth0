import express, { Request, Response } from 'express';
import { AuthControllerInstance } from 'controllers'
import { auth, callback, jwt, provider } from 'middlewares'
import { env } from 'utils';

export class AuthRouter {
  router: express.Router;

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
      this.router.get(`/${providerName}`, callback, (req: Request | any) => provider(providerName, req.callback))
      this.router.get(`/${providerName}/callback`, callback, (req: Request | any) => provider(providerName, req.callback), (req: Request, res) =>
        AuthControllerInstance.generateUserTokenAndRedirect(req, res)
      )
    })
  }
}

export const AuthRouterInstance = new AuthRouter();