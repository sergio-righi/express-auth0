import fs from 'fs';
import { join } from 'path';
import { VerifiedCallback } from 'passport-jwt';

import { UserModel } from '../models';
import { env, helper } from '../utils';

class AuthService {

  init() {
    const providersPath = join(__dirname, '..', 'providers');
    fs.readdirSync(providersPath).forEach((file) => {
      const authFile = helper.removeExtensionFromFile(file);
      import(join(providersPath, authFile));
    });
  };

  getConfigByProviderName(providerName: string) {
    return {
      clientID: env.get(`provider.${providerName}.clientID` as any),
      clientSecret: env.get(`provider.${providerName}.clientSecret` as any),
      scope: env.get(`provider.${providerName}.scope` as any),
      callbackURL: this._getAuthCallbackUrl(providerName),
    };
  };

  processUserFromSSO(req: any, profile: any, origin: string, done: VerifiedCallback) {
    UserModel.findOneAndUpdate(
      { origin, originId: profile.id },
      {
        email: profile.email,
        name: profile.name,
        origin,
        verified: true,
        originId: profile.id,
      },
      { upsert: true },
      (err: any, user: any) => {
        if (err) return done(err);
        req.currentUser = user;
        return done(null, user);
      },
    );
  }

  _getAuthCallbackUrl(providerName: string) {
    return `${env.get('url.backend')}auth/${providerName}/callback`;
  }

  async find(query: any) {
    try {
      const response = await UserModel.findOne({ ...query, password: { $exists: true } }, { new: true });
      return { status: 200, data: response };
    } catch (error: any) {
      return { status: 500 }
    }
  }
}

export default new AuthService();