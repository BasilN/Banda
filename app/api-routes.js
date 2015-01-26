var User = require('../app/models/user');

module.exports = function(app) {
  //api ------------------------------------------------------------------------
  //get all users
  app.get('/api/users', function(req, res){
    User.find(function(err, users){

      if(err)
        res.send(err)

      res.json(users)
    });
  });
}
