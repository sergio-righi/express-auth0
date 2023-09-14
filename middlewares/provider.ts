import passport from 'passport';

export function provider(providerName: string, callback: string) {
  passport.authenticate(providerName, {
    session: false,
    userProperty: 'currentUser',
    failureRedirect: callback
  })
}