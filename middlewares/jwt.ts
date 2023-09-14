import passport from 'passport';

export function jwt() {
  passport.authenticate('jwt', {
    userProperty: 'currentUser',
    session: false,
  })
};