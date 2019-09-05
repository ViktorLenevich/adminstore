var express = require('express');
var router = express.Router();
var adminData = require('./../models/login.model');

router.get('/', function (req, res, next) {
   if(req.session.login == adminData.login && req.session.password == adminData.password){
      res.render('home');
   }
   else{
      res.render('login');

   }
  
});

router.post('/', function (req, res, next) {
   if (req.body.login == adminData.login && req.body.password == adminData.password) {
     
      req.session.login = adminData.login;
      req.session.password =  adminData.password;
      res.redirect('/home');

   }
   else {
      //res.status(404).json('Not found.');
      res.render('error-login');
   }
});
module.exports = router;
