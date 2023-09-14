import passport from 'passport';
import { Request } from 'express';
import { VerifiedCallback } from 'passport-jwt';
import { Strategy as GithubStrategy } from 'passport-github2';

import { AuthServiceInstance } from 'services';
import { ProviderType } from 'interfaces';

export class GitHubProvider {
  #providerName = 'github';
  #passportConfig: ProviderType

  constructor() {
    this.#passportConfig = AuthServiceInstance.getConfigByProviderName(this.#providerName);
    if (this.#passportConfig.clientID) {
      passport.use(
        new GithubStrategy(
          { ...this.#passportConfig, passReqToCallback: true },
          (req: Request, accessToken: string, refreshToken: string, profile: any, verified: VerifiedCallback) => {
            AuthServiceInstance.processUserFromSSO(req, this.#processUserData(profile), this.#providerName, verified);
          },
        ),
      );
    }
  }

  #processUserData = ({ _json: json }) => {
    return {
      id: json.id,
      name: json.name,
      email: json.email,
      avatar: json.avatar_url
    }
  }
}

export const GitHubProviderInstance = new GitHubProvider();