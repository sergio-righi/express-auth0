import cors from 'cors';
import express from 'express'
import passport from 'passport'

import { Db } from './config'
import { env } from './utils'
import { AuthRoute, MailRoute, TokenRoute } from './routes'

class App {
  express: express.Express;

  constructor() {
    this.express = express();

    Db.connect().then(() => {
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
    // this.express.options('*', cors())
    this.express.use('/auth', AuthRoute)
    this.express.use('/mail', MailRoute)
    this.express.use('/token', TokenRoute)
  }
}

export default new App().express;