// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieparser = require('cookie-parser');
var bodyparser   = require('body-parser');
var session      = require('express-session');
var path         = require('path')

var configDB = require('./config/database.js');

//configuration ================================================================
mongoose.connect(configDB.url); //connect to our database

require('./config/passport')(passport); //pass passport for configuration
//app.use(express.static(path.resolve(__dirname +'/public')));                 // set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));
//set up our express application
app.use(morgan('dev'));          // log every  request to the console
app.use(cookieparser());         // read cookies (needed for authentication)
app.use(bodyparser());           // get information from html forms
//app.set('view engine', 'ejs');   // set up ejs for templating

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//required for passport
app.use(session({secret:'mysecret'}));    // session secret
app.use(passport.initialize());
app.use(passport.session());    // persistent login sessions
app.use(flash()); //use connect-flash for flash messages stored in session

//routes =======================================================================
//require('./app/routes.js')(app, passport);  //load our routes and pass in our app and fully configured passport
require('./app/api-routes.js')(app, passport);

app.get('*', function(req, res){
  res.sendfile('./public/index.html')
})
//launch =======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
