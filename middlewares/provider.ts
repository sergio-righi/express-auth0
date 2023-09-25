import express, { NextFunction, Request, Response } from 'express';
import passport from 'passport';

import { env } from "utils";

export function provider(req: Request, res: Response, next: NextFunction, providerName: string) {
  passport.authenticate(providerName, {
    session: false,
    userProperty: 'currentUser',
    failureRedirect: env.get('url.frontend')
  })(req, res, next)
  next()
}