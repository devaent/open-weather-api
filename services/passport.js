const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;

require('../models/User');
const User = mongoose.model('User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new LocalStrategy(
    {
      usernameField : 'email',
      passwordField : 'password',
    },
    async (email, password, done) => {
      try {
        const existingUser = await User.findOne({ 'local.email' : email });
        if (existingUser) {
          return done(null, existingUser);
        }
        const user = await new User({
          local: {
            email : email,
            password : this.generateHash(password)
          }
        }).save();
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
