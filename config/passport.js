    // config/passport.js

    //load all the things we need
    var LocalStrategy = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var TwitterStrategy = require('passport-twitter').Strategy;
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

    var User = require('../app/models/user');

    var configAuth = require('./auth');

    //expose this function to our app using module.exports
    module.exports = function(passport){
        // =========================================================================
        // passport session setup ==================================================
        //==========================================================================
        //required for persistent login sessions
        //passport needs ability to serialize and unserialize users out of session

        //used to serialize the user for the session
        passport.serializeUser(function(user, done){
          done(null, user.id);
        });

        //used to deserialize user
        passport.deserializeUser(function(id, done){
            User.findById(id, function(err, user){
              done(err, user);
            });
        });


        // =========================================================================
        // FACEBOOK ============================================================
        // =========================================================================
        passport.use(new FacebookStrategy({
          clientID       : configAuth.facebookAuth.clientID,
          clientSecret   : configAuth.facebookAuth.clientSecret,
          callbackURL    : configAuth.facebookAuth.callbackURL,
          passReqToCallback :true// allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(req, token, refreshToken, profile, done){
          process.nextTick(function(){
            //check if user is already logged in
            if(!req.user){
              User.findOne({'facebook.id' : profile.id}, function(err, user){
                if(err)
                  return done(err);

                  if(user){
                    // if there is a user id already but no token (user was linked at one point and then removed)
                    // just add our token and profile information
                    if (!user.facebook.token) {
                      user.facebook.token = token;
                      user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                      user.facebook.email = profile.emails[0].value;

                      user.save(function(err) {
                        if (err)
                          throw err;
                          return done(null, user);
                        });
                      }
                    return done(null, user);

                  } else {

                    var newUser = new User();
                    newUser.facebook.id = profile.id;
                    newUser.facebook.token = token;
                    newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                    newUser.facebook.email = profile.emails[0].value;

                    newUser.save(function(err){
                      if(err)
                        throw err;
                        return done(null, newUser);
                      });
                    }
                });
            } else {
              //user already exists and we have to link accounts
              var user  = req.user; //pull the user out of the session

              //update the current user's facebook credentials
              user.facebook.id    = profile.id;
              user.facebook.token = token;
              user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
              user.facebook.email = profile.emails[0].value;

              //save user
              user.save(function(err){
                if(err)
                  throw err;
                return done(null, user);
              });
            }
          });
        }));
        // =========================================================================
        // Twitter ============================================================
        // =========================================================================
        passport.use(new TwitterStrategy({
          consumerKey    : configAuth.twitterAuth.consumerKey,
          consumerSecret : configAuth.twitterAuth.consumerSecret,
          callbackURL    : configAuth.twitterAuth.callbackURL,
          passReqToCallback :true
        },
        function(req, token, tokenSecret, profile, done){
          process.nextTick(function(){
            if(!req.user){
                User.findOne({'twitter.id' : profile.id}, function(err, user){
                  if(err)
                    return done(err);

                    if(user){
                      // if there is a user id already but no token (user was linked at one point and then removed)
                      // just add our token and profile information
                      if (!user.twitter.token) {
                        user.twitter.token = token;
                        user.twitter.name  = profile.username;
                        user.twitter.displayName = profile.displayName;

                        user.save(function(err) {
                          if (err)
                            throw err;
                            return done(null, user);
                          });
                        }
                      return done(null, user);
                    }
                    else {
                      var newUser = new User();
                      newUser.twitter.id = profile.id;
                      newUser.twitter.token = token;
                      newUser.twitter.username = profile.username;
                      newUser.twitter.displayName = profile.displayName;

                      newUser.save(function(err){
                        if(err)
                          throw err;
                          return done(null, newUser);
                        });
                      }
                    });
              } else {
                  var user = req.user;
                  user.twitter.id = profile.id;
                  user.twitter.token = token;
                  user.twitter.username = profile.username;
                  user.twitter.displayName = profile.displayName;

                  user.save(function(err){
                    if(err)
                      throw err;
                      return done(null, user);
                    });
              }
          });
        }));

        // =========================================================================
        // GOOGLE ==================================================================
        // =========================================================================
        passport.use(new GoogleStrategy({

          clientID        : configAuth.googleAuth.clientID,
          clientSecret    : configAuth.googleAuth.clientSecret,
          callbackURL     : configAuth.googleAuth.callbackURL,
          passReqToCallback :true
        },
        function(req, token, refreshToken, profile, done) {

          // make the code asynchronous
          // User.findOne won't fire until we have all our data back from Google
          process.nextTick(function() {
            if(!req.user){
              User.findOne({ 'google.id' : profile.id }, function(err, user) {
                if (err)
                  return done(err);

                  if (user) {
                    // if there is a user id already but no token (user was linked at one point and then removed)
                    // just add our token and profile information
                    if (!user.google.token) {
                      user.google.token = token;
                      user.google.name  = profile.displayName;
                      user.google.email = profile.emails[0].value;

                      user.save(function(err) {
                        if (err)
                          throw err;
                          return done(null, user);
                        });
                      }
                    // if a user is found, log them in
                    return done(null, user);
                  } else {
                    // if the user isnt in our database, create a new user
                    var newUser          = new User();

                    // set all of the relevant information
                    newUser.google.id    = profile.id;
                    newUser.google.token = token;
                    newUser.google.name  = profile.displayName;
                    newUser.google.email = profile.emails[0].value; // pull the first email

                    // save the user
                    newUser.save(function(err) {
                      if (err)
                        throw err;
                        return done(null, newUser);
                    });
                  }
              });
            } else {
                var user = req.user;

                // set all of the relevant information
                user.google.id    = profile.id;
                user.google.token = token;
                user.google.name  = profile.displayName;
                user.google.email = profile.emails[0].value; // pull the first email

                // save the user
                user.save(function(err) {
                  if (err)
                    throw err;
                    return done(null, user);
                });
            }

          });

        }));
        // =========================================================================
        // LOCAL SIGNUP ============================================================
        // =========================================================================

        //we are using named strategies since we have one for login and one for signup
        //by default, if there was no name, it would just be called 'local'

          passport.use('local-signup', new LocalStrategy({
          // by default, local strategy uses username and password, we will override with email
          usernameField :'email',
          passwordField :'password',
          passReqToCallback :true //allows us to pass back the entire request to the callback
          },
          function(req, email, password, done) {
            if (email)
              email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
            //asynchronous
            // Use.findOne wont fire unless data is sent back
            process.nextTick(function(){
              if(!req.user) {
                //find use by name
                User.findOne({'local.email': email}, function(err, user){
                  if(err)
                    return done(err);
                    //check to see if there's a user with that email
                    if(user){
                      return done(null, false, req.flash('signupMessage', 'That email is already taken'));
                    }
                    else{
                      var newUser = new User();
                      newUser.local.email = email;
                      newUser.local.password = newUser.generateHash(password);

                      newUser.save(function(err){
                        if(err)
                          throw err;
                          return done(null, newUser);
                      });
                    }
                  });
              } else if ( !req.user.local.email ) {
                // ...presumably they're trying to connect a local account
                // BUT let's check if the email used to connect a local account is being used by another user
                User.findOne({ 'local.email' :  email }, function(err, user) {
                  if (err)
                    return done(err);

                    if (user) {
                      return done(null, false, req.flash('loginMessage', 'That email is already taken.'));
                      // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
                    } else {
                      var user = req.user;
                      user.local.email = email;
                      user.local.password = user.generateHash(password);
                      user.save(function (err) {
                        if (err)
                          return done(err);

                          return done(null,user);
                        });
                      }
                    });
                  } else {
                    // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                    return done(null, req.user);
                  }
            });
          }));

          // =========================================================================
          // LOCAL LOGIN ============================================================
          // =========================================================================

          passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback :true
          },
          function(req, email, password, done){
            if (email)
              email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
            //asynchronous
            process.nextTick(function(){
              User.findOne({'local.email': email}, function(err, user){
                if(err)
                  return done(err);
                if(!user)
                  return done(null, false, req.flash('loginMessage', 'No user found.'));

                if (!user.validPassword(password))
                  return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                else
                  return done(null, user);

                });
            });

          }));
  };
