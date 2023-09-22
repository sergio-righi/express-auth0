import cors from 'cors';
import express from 'express'
import passport from 'passport'

import { env } from './utils'
import { DbInstance } from './config'
import { AuthRouterInstance, TokenRouterInstance } from './routes'

class App {
  express: express.Express;

  constructor() {
    this.express = express();

    DbInstance.connect().then(() => {
      this.#setConfiguration();
      this.#setRoute();
    });
  }

  #setConfiguration() {
    this.express.use(cors({
      origin: new RegExp(env.get('cors')),
    }))
    this.express.use(express.json())
    this.express.use(passport.initialize())
    this.express.use(express.urlencoded({ extended: true }))
  }

  #setRoute() {
    this.express.use('/auth', AuthRouterInstance as any)
    this.express.use('/token', TokenRouterInstance)
  }
}

export default new App().express;