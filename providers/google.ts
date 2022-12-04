import passport from 'passport';
import { Request } from 'express';
import { VerifiedCallback } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';

import { AuthService } from '../services';
import { ProviderType } from '../interfaces';

class GoogleProvider {
  #providerName = 'google';
  #passportConfig: ProviderType

  constructor() {
    this.#passportConfig = AuthService.getConfigByProviderName(this.#providerName);
    if (this.#passportConfig.clientID) {
      passport.use(
        new GoogleStrategy(
          { ...this.#passportConfig, passReqToCallback: true },
          (req: Request, accessToken: string, refreshToken: string, profile: any, verified: VerifiedCallback) => {
            AuthService.processUserFromSSO(req, this.#processUserData(profile), this.#providerName, verified);
          },
        ),
      );
    }
  }

  #processUserData = ({ _json: json }) => {
    return {
      id: json.sub,
      name: json.name,
      email: json.email,
      avatar: json.picture
    }
  }
}

export default new GoogleProvider();