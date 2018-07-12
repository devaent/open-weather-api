const passport = require('passport');
require('../services/passport');

module.exports = app => {
  app.use(passport.initialize());
  app.use(passport.session());
  app.post('/signup', passport.authenticate('local', {
    successRedirect : '/',
    failureRedirect : '/signup'
  }));
  app.get('/signup', (req, res) => {

  })
};
