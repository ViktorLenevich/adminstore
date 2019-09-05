var express = require('express');
var router = express.Router();
var path = require('path');
const multer = require('multer');
const mkdirp = require('mkdirp');
const config = require('../config');
var Category = require('./../models/category.model');



const rs = () => Math.random().toString(36).slice(-12);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = '/photos/' + rs();

        req.dir = dir;
        mkdirp(config.DESTINATION + dir, err => cb(err, config.DESTINATION + dir))
        // cb(null, config.DESTINATION + dir);

    },
    filename: (req, file, cb) => {        
        fileName = 'original' + path.extname(file.originalname);
           cb(null, fileName);
    },
   
});

//const fullPath = config.DESTINATION + dir + fileName;

const upload = multer({
    storage,
    limits: {fileSize: 2 * 1024 * 1024},
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if(ext !=='.png'){
            const err = new Error('Extention');
            console.log(err);
            // err.code = "EXTENTION"
            // return cb(err);
        }
        cb(null, true)
    }
}).single('file');


//POST new image

router.post('/image', async(req, res) => {

   

    upload(req, res, err => {
        let error = '';
        if(err){
            if(err.code === 'LIMIT_FILE_SIZE'){
                error = "Picture no more 1mb!"
            }
            if(err.code === 'EXTENTION'){
                error = "Only jpeg and png!"
            }
        }
        res.json({
            ok: !error,
            error
    
        })
     
      
        
    });
   

});

module.exports = router;