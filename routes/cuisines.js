var express = require('express');
var router = express.Router();
const errorHandler = require('../utils/errorHandler');
var path = require('path');
const multer = require('multer');
const mkdirp = require('mkdirp');
const config = require('../config');
var Cuisine = require('../models/cuisine.model');
var Dish = require('./../models/dish.model');
var adminData = require('../models/login.model');



const rs = () => Math.random().toString(36).slice(-12);
//Image storage
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


// Get all cuisines
router.get('/', Guard, async(req, res) => {
    try {
        await Cuisine.find({}, (err, cuisines) => {
          
        res.render('cuisines', { cuisines: cuisines });
       
        });

    } catch (e) {
        errorHandler(res, e)
    }
});



// Get cuisine with {id}
router.get('/:id', Guard, async(req, res) => {

    try {
        await Cuisine.findOne({_id: req.params.id}, (err, cuisine) => {
       
            if(err){
                res.status(404).json(err);
            }
            else{
               res.status(200).send({cuisine: cuisine});
            }     
         });

    } catch (e) {
        errorHandler(res, e);
    }
});








// Create new cuisine
router.post('/uploads', Guard, upload.single("file"), async(req, res) => {

    var cuisine = new Cuisine({ title: req.body.title, icon_id: req.file.destination.replace('photos/', '') });
    try{
        await cuisine.save()
        res.status(201).redirect('/cuisines');

    } catch (e) {
        errorHandler(res, e);
    }
});



//DELETE cuisine
router.delete('/:id', Guard, async(req, res) => {
    try{
        await Cuisine.deleteOne({ _id: req.params.id }, (err) => {
           
            res.status(200).send('OK');
         
    });
    } catch (e) {
        errorHandler(res, e);
    }
  
});



// Edit cuisine with {id}
router.get('/edit/:id', Guard,  async(req, res) => {
    try{
        await Cuisine.findById(req.params.id, (err, cuisines) => {
            var id = req.params.id;                                  
            res.send(id);              
        }); 
    } catch (e) {
        errorHandler(res, e);
    }
   
});



//Update cuisine
router.post('/edit/:id', Guard, upload.single("files"), async(req, res) => {

    let cuisine = {};
    cuisine.title = req.body.title_edit;
    cuisine.title_lc = req.body.title_edit.toLowerCase();
    cuisine.icon_id = req.file.destination.replace('photos/', '');
    cuisine.version = 1;
    let query = {_id:req.params.id};

    try{
       await Cuisine.updateOne(query, cuisine, (err) => {
            res.redirect('/cuisines');            
           
        });
        

    } catch (e) {
      errorHandler(res, e);
    } 
});





module.exports = router;