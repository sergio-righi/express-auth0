import passport from 'passport';
import { Request } from 'express';
import { Strategy as JwtStrategy, VerifiedCallback } from 'passport-jwt';

import { UserModel } from '../models';
import { crypto, enums, env, helper, jwt } from '../utils';

class JWTProvider {
  constructor() {
    passport.use(
      new JwtStrategy(
        {
          jwtFromRequest: (req: Request) => {
            try {
              if (!req.headers.authorization) {
                throw new Error('token was not provided, authorization header is empty');
              }

              const authorization = helper.fromBearerToken(req.headers.authorization);
              const decryptedToken = crypto.decrypt(authorization);
              const tokenType = jwt.getTokenType(decryptedToken);

              if (tokenType !== enums.TokenType.ACCESS_TOKEN) {
                throw new Error('wrong token type provided');
              }

              return decryptedToken;
            } catch (err: any) {
              console.error('Token is not valid', err.message);
              return null;
            }
          },
          secretOrKey: env.get('authentication.secret'),
          passReqToCallback: true,
        },
        async (req: any, payload: any, done: VerifiedCallback) => {
          const response = await UserModel.findById(payload.sub).select('-password');
          if (response) {
            req.currentUser = response;
            return done(null, response);
          } else {
            return done(null, false);
          }
        },
      ),
    );
  }
}

export default new JWTProvider();