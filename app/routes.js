// app/routes.js
// Maybe swith this to angular routing later ??
module.exports= function(app, passport){

  // ============================================================
  // Home Page (with login links)
  // ============================================================
  app.get('/', function(req, res){
    res.render('index.ejs'); // load the index.ejs file
  });

  // ============================================================
  // LOGIN
  // ============================================================
  // show the login form
  app.get('/login', function(req, res){
    // render page and pass in any flash data if exists
    res.render('login.ejs', {message:req.flash('loginMessage')});

    //process login form
    app.post('/login', passport.authenticate('local-login',{
      successRedirect :'/profile',
      failureRedirect :'/login',
      failureFlash : true //allow flash messages
    }));
  });

  // ============================================================
  // SIGNUP
  // ============================================================
  // show the sign up form
  app.get('/signup', function(req, res){
    res.render('signup.ejs', {message:req.flash('signupMessage')});

    //process the signup form
    app.post('/signup', passport.authenticate('local-signup',{
      successRedirect :'/profile',
      failureRedirect :'/signup',
      failureFlash :true
    }));
  });

  // ============================================================
  // FACEBOOK ============================================
  // ============================================================
  // route for facebook authentication and login
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope : 'email'
  }));

  //handle the callback afer facebok has athenticated the user
  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect :'/profile',
    failureRedirect :'/'
  }));

  // TWITTER ============================================
  // ============================================================
  // routes for twitter authentication and login
  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect :'/profile',
    failureRedirect :'/'
  }));

  // Google ============================================
  // ============================================================
  // routes for google authentication and login
  app.get('/auth/google', passport.authenticate('google', {
     scope : ['profile', 'email'] }));

  // the callback after google has authenticated the user
  app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect : '/profile',
    failureRedirect : '/'
  }));

  // =============================================================================
  // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
  // =============================================================================

  //locally ----------------------------------------------------------------------
  app.get('/connect/local', function(req, res){
    res.render('connect-local.ejs', {message: req.flash('loginMessage')});
  });
  app.post('/connect/local', passport.authenticate('local-signup', {
    successRedirect : '/profile',
    failureRedirect : '/connect/local',
    failureFlash : true
  }));

  //facebook --------------------------------------------------------------------
  app.get('/connect/facebook', passport.authorize('facebook', {
    scope : 'email'
  }));

  app.get('/connect/facebook/callback', passport.authorize('facebook',{
      successRedirect : '/profile',
      failureRedirect : '/'
  }));

  //twitter --------------------------------------------------------------------
  app.get('/connect/twitter', passport.authorize('twitter', {
    scope : 'email'
  }));

  app.get('/connect/twitter/callback', passport.authorize('twitter', {
    successRedirect :'/profile',
    failureRedirect :'/'
  }));

  //google ---------------------------------------------------------------------
  app.get('/connect/google', passport.authorize('google', {
    scope :['profile', 'email']
  }));

  app.get('/connect/google/callback', passport.authorize('google', {
    successRedirect : '/profile',
    failureRedirect : '/'
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  //local ----------------------------------------------------------
  app.get('/unlink/local', function(req, res) {
    var user            = req.user;
    user.local.email    = undefined;
    user.local.password = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });

  //facebook --------------------------------------------------
  app.get('/unlink/facebook', function(req, res){
    var user            = req.user;
    user.facebook.token = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });

  // twitter --------------------------------
  app.get('/unlink/twitter', function(req, res) {
    var user           = req.user;
    user.twitter.token = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });

  // google ---------------------------------
  app.get('/unlink/google', function(req, res) {
    var user          = req.user;
    user.google.token = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });

  // ============================================================
  // PROFILE SECTION ============================================
  // ============================================================
  // show the profile page protected by login method
  app.get('/profile', isLoggedIn, function(req, res){
    res.render('profile.ejs', {
        user: req.user //get the user out of session and pass to template
      });
  });

  // ============================================================
  // LOGOUT ============================================
  // ============================================================

    app.get('/logout', function(req, res){
      req.logout();
      req.redirect('/');
    });
};

  //route middleware to make sure a user is logged in
  function isLoggedIn(req, res, next){

    //if user is authenticated in the session, carry on
    if(req.isAuthenticated())
      return next();

    //if they aren't redirect them to the home page
    res.redirect('/');
  }
