var express = require('express');
var router = express.Router();
var adminData = require('./../models/login.model');

var Guard = function (req, res, next) {
  if (req.session.login == adminData.login && req.session.password == adminData.password) {
    res.render('home');
  }
  else {
    res.redirect('/')

  }
};

/* GET home page. */
router.get('/', Guard, function (req, res, next) {
   
    res.render('home');
 
});

module.exports = router;
