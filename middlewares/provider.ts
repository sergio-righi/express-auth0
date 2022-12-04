import passport from 'passport';
import { env } from '../utils';

export default (providerName: string) => passport.authenticate(providerName, {
  session: false,
  userProperty: 'currentUser',
  failureRedirect: env.get('url.frontend')
})