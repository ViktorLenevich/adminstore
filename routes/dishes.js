var express = require('express');
var router = express.Router();

var path = require('path');
const multer = require('multer');
const mkdirp = require('mkdirp');
const config = require('../config');
var adminData = require('../models/login.model');

var Cuisine = require('../models/cuisine.model');
var Category = require('./../models/category.model');
var Dish = require('./../models/dish.model');

// Guard for secutiry routers
var Guard = function (req, res, next) {
    if (req.session.login == adminData.login && req.session.password == adminData.password) {
        next();
    }
    else {
        res.redirect('/');
    }
};

const rs = () => Math.random().toString(36).slice(-12);

//Storage image

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
var upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (ext !== '.jpeg' && ext !== '.jpg') {
            cb(null, false)

        }

        cb(null, true)


    }
});



router.get('/', Guard, async (req, res) => {
    try {
        let dishes=[];
        const categories = await Category.find({});
        const cuisines = await Cuisine.find({});
        let selectcat = 'All';
        let selectcui = 'All';
        let catfilter= req.query.catfilter;
        let cuifilter = req.query.cuifilter;

        if (catfilter) {
            currentcat= await Category.findById(catfilter);
             selectcat = currentcat.title;
       }
       if(cuifilter){
        currentui= await Cuisine.findById(cuifilter);
            selectcui =currentui.title;
       }


        await Dish.find({}, (err, data)=>{
            dishes=data;
            if (catfilter) {
                 dishes = dishes.filter(d => d.category_id === catfilter);
            }
            if(cuifilter){
                dishes = dishes.filter(d=>d.cuisine_id===cuifilter);
            }
    
        });
       

        



        res.render('dishes', { dishes: dishes, category: categories, cuisines: cuisines, selectcat: selectcat, selectcui: selectcui });





    } catch (e) {
        errorHandler(res, e);
    }
});


router.get('/filter', Guard, async (req, res) => {
    console.log(req.query.catfilter);

});


//Create a new dish
router.post('/uploads', Guard, upload.array("file", 100), async (req, res) => {

    arr = []; //upload files
    for (let i = 0; i < req.files.length; i++) {
        arr.push(req.files[i].destination.replace('photos/', ''));

    }

    let alternative = ""; //upload alternative name
    for (let i = 0; i < req.body.alternative.length; i++) {
        if (i === 0) {
            alternative += req.body.alternative[i];
        } else {
            alternative += "^" + req.body.alternative[i];
        }
    }

    var dish = new Dish({

        title: req.body.title,
        photo_id: arr,
        category_id: req.body.category,
        cuisine_id: req.body.cuisine,
        source: req.body.source,
        alternative: alternative,
        alternative_lc: alternative,
        description: req.body.description,

    });


    let cuisine = await Cuisine.findById({ _id: dish.cuisine_id });

    await Cuisine.findOneAndUpdate({ _id: cuisine._id }, { $set: { version: cuisine.version += 1 } }, (err, result) => { });

    try {
        await dish.save();
        res.status(201).redirect('/dishes');

    } catch (e) {
        errorHandler(res, e);
    }
});

//DELETE cuisine
router.delete('/:id', Guard, async (req, res) => {

    let dish = await Dish.findById({ _id: req.params.id });
    let cuisine = await Cuisine.findById({ _id: dish.cuisine_id });
    await Cuisine.findOneAndUpdate({ _id: cuisine._id }, { $set: { version: cuisine.version += 1 } }, (err, result) => { });

    try {
        await Dish.deleteOne({ _id: req.params.id }, (err) => {

            res.status(200).send('OK');

        });
    } catch (e) {
        errorHandler(res, e);
    }

});

//DELETE image cuisine
router.delete('/edit/image/:id', Guard, async (req, res) => {

    let dish = await Dish.findOne({ _id: req.params.id });
    let image_id = req.query.imageid;
    const images = dish.photo_id.filter(photo => photo !== image_id);
    dish.photo_id = images;

    try {
        await Dish.updateOne({ _id: req.params.id }, dish);



    } catch (e) {
        errorHandler(res, e);
    }

});


// Ger edit dish with {id}
router.get('/edit/:id', Guard, async (req, res) => {
    try {
        await Dish.findById(req.params.id, (err, dishes) => {
            var id = req.params.id;
            res.send(id);

        });
    } catch (e) {
        errorHandler(res, e);
    }

});

//Update cuisine
router.post('/edit/:id', Guard, upload.array("filenew", 100), async (req, res) => {




    let alternative_edit = "";
    for (let i = 0; i < req.body.alternative_edit.length; i++) {
        if (i === 0) {
            alternative_edit += req.body.alternative_edit[i];
        } else {
            alternative_edit += "^" + req.body.alternative_edit[i];
        }
    }

    let dish = await Dish.findById({ _id: req.params.id });
    dish.title = req.body.title_edit,

        arr_edit = [];
    if (req.files.length == 0) {

        dish.photo_id = dish.photo_id


    } else {
        for (let i = 0; i < req.files.length; i++) {
            arr_edit.push(req.files[i].destination.replace('photos/', ''));


        }
        dish.photo_id = arr_edit

    }


    dish.category_id = req.body.category_edit,
        dish.cuisine_id = req.body.cuisine_edit,
        dish.source = req.body.source_edit,
        dish.source_lc = req.body.source_edit,
        dish.alternative = alternative_edit,
        dish.alternative_lc = alternative_edit,
        dish.description = req.body.description_edit;
    dish.description_lc = req.body.description_edit;
    dish.version += 1;

    let cuisine = await Cuisine.findById({ _id: dish.cuisine_id });
    await Cuisine.findOneAndUpdate({ _id: cuisine._id }, { $set: { version: cuisine.version += 1 } }, (err, result) => { });

    let query = { _id: req.params.id };

    try {
        await Dish.updateOne(query, dish, (err) => {
            res.redirect('/dishes');

        });

    } catch (e) {
        errorHandler(res, e);
    }
});



// router.post('/filter', Guard, async (req, res) => {



//     const category_id = req.body.cat_id__filter;
//     const cuisine_id = req.body.cui_id__filter;

//     console.log(category_id);




//     try {
//         await Dish.find({}, (err, dishes) => {

//             res.send(dishes);
//             console.log(dishes);

//         });



//     } catch (e) {
//         errorHandler(res, e);
//     }
// });


module.exports = router;