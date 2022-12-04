import passport from 'passport';

export default passport.authenticate('jwt', {
  userProperty: 'currentUser',
  session: false,
});