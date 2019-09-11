var express = require('express');
var router = express.Router();
const errorHandler = require('../utils/errorHandler');

var path = require('path');
const multer = require('multer');
const mkdirp = require('mkdirp');
const config = require('../config');
var adminData = require('../models/login.model');

var Category = require('./../models/category.model');



const rs = () => Math.random().toString(36).slice(-12);
//Storage for image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = '/' + rs();
    req.dir = dir;
    mkdirp(config.DESTINATION + dir, err => cb(err, config.DESTINATION + dir))
  
  },
  filename: (req, file, cb) => {
    fileName = 'original' + path.extname(file.originalname);
    cb(null, fileName);
  },


});

//Upload image
const upload = multer({
  storage,
 
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.png') {
      cb(null, false)
      // const err = new Error('Extention');

      // err.code = "EXTENTION"
      // return cb(err);
    }
    cb(null, true)
  }
});

// Guard for secutiry routers
var Guard = function (req, res, next) {
  if (req.session.login == adminData.login && req.session.password == adminData.password) {
    next();
  }
  else {
    res.redirect('/');
  }
};


//Create a new categories
router.post('/uploads', Guard, upload.single("file"), async (req, res, err) => {
 

  try {

    var category = new Category({
      title: req.body.title,
      icon_id: req.file.destination.replace('photos/', '')

    });

 
    category.save();
    res.status(201).redirect('/categories');

  }
  catch (e) {
    errorHandler(res, e);
  }

});


// GET all categories
router.get('/', Guard, async (req, res) => {

  try {
    await Category.find({}, function (err, categories) {
      res.render('categories', { categories: categories });
      // res.send(categories);

    });
  }
  catch (e) {
    errorHandler(res, e);
  }
});


//DELETE cuisine
router.delete('/:id', Guard, async (req, res) => {
  try {
    await Category.deleteOne({ _id: req.params.id }, (err) => {

      res.status(200).send('OK');

    });
  } catch (e) {
    errorHandler(res, e);
  }

});


// Edit cuisine with {id}
router.get('/edit/:id', Guard, async(req, res) => {
  try{
      await Category.findById(req.params.id, (err, categories) => {
          var id = req.params.id;                                  
          res.send(id);
                      
      }); 
  } catch (e) {
      errorHandler(res, e);
  }
 
});


//Update cuisine
router.post('/edit/:id', Guard, upload.single("files"), async(req, res) => {
   
  let category = {};
  category.title = req.body.title_edit;
  category.title_lc = req.body.title_edit.toLowerCase();
 
 
  category.icon_id = req.file.destination.replace('photos/', '');
    
  
  
 
  category.version = 1;
 

  let query = {_id:req.params.id};

  try{
     await Category.updateOne(query, category, (err) => {
          res.redirect('/categories');            
         
      });

  } catch (e) {
    errorHandler(res, e);
  } 
});



module.exports = router;
