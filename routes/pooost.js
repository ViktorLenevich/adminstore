var express = require('express');
var router = express.Router();

var path = require('path');
const multer = require('multer');
const mkdirp = require('mkdirp');
const config = require('../config');
var upload = multer({ dest: 'uploads/' })


router.post('/test', upload.array('files', 12), function (req, res, next) {
    // req.files - массив файлов `photos`
    // req.body сохранит текстовые поля, если они будут
    console.log(req.files);
})

module.exports = router;