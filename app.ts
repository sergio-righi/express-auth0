import cors from 'cors';
import express from 'express'
import passport from 'passport'

import { env } from './utils'
import { DbInstance } from './config'
import { AuthRouterInstance, TokenRouterInstance } from './routes'

class App {
  express: express.Express;
  cors: any = {
    origin: new RegExp(env.get('cors')),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  };

  constructor() {
    this.express = express();

    DbInstance.connect().then(() => {
      this.#setConfiguration();
      this.#setRoute();
    });
  }

  #setConfiguration() {
    this.express.use(cors(this.cors))
    this.express.use(express.json())
    this.express.use(passport.initialize())
    this.express.use(express.urlencoded({ extended: true }))
  }

  #setRoute() {
    this.express.use('/auth', AuthRouterInstance)
    this.express.use('/token', TokenRouterInstance)
  }
}

export default new App().express;