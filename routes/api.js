var express = require('express');
var router = express.Router();
var errorHandler = require('../utils/errorHandler');

var Category = require('../models/category.model');
var Dish = require('../models/dish.model');
var Cuisine = require('../models/cuisine.model');
var objectMapper = require('object-mapper');

var adminData = require('../config/config.json');


// Guard API
var Guard = function (req, res, next) {

  if (req.query.api_key === adminData.api_key) {

    next();

  }

  else {

    res.json("ApiKey invalid");

  }
};




// Get all categories
router.get('/categories', Guard, async (req, res) => {

  try {

    await Category.find({}, function (err, category) {

      const map = {
              
        "_id": "id",       
        "title": "title",        
        "icon_id": [
          {
            key: "icon_id",
            transform: function (value) {
              let str="";
              for (let i = 0; i < value.length; i++) {

                if(i === 0){  

                str+= value[i];
              } else{
            
                str+= ", " + value[i];

              }
              }
              return str;
            }
          }
        ],
        "title_lc": "title_lc",     
        "last_updated": "last_updated",
      

      }

      const results = [];
    
      for(let i=0; i<category.length; i++){
       
        const result = objectMapper(category[i], map);
        results.push(result);
       

      }
      return res.send(results);
    

    });

  } catch (e) {

    res.json('Error get categories');

  }

});

// Get all dishes of category
router.get('/category/:id', Guard, async (req, res) => {

  try {
    await Category.findOne({ _id: req.params.id }, function (err, category) {

      if (err) {
        res.status(404).json(err);
      }
      else {
        Dish.find({ category_id: req.params.id }, function (err, dish) {
          if (err) {
            res.json('Error get dishes')

          } else {

            
            const map = {
              
              "_id": "id",
              "category_id": "category_id",
              "cuisine_id": "cuisine_id",
              "title": "title",
              "description": "description",       
              "photo_id": [
                {
                  key: "photo_id",
                  transform: function (value) {
                    let str="";
                    for (let i = 0; i < value.length; i++) {

                      if(i === 0){
                       
                        
                        
                        str+= value[i];
                      } else{
                        
                         
                        
                        str+= ", " + value[i];
    
                      }
                    }
                    return str;
                  }
                }
              ],
              "source": "source", 
              "alternative": "alternative",                        
              "title_lc": "title_lc",
              "description_lc": "description_lc",
              "source_lc": "source_lc",  
              "alternative_lc": "alternative_lc",                 
              "last_updated": "last_updated",
              "version": "version",
      
            }

            const results = [];
          
            for(let i=0; i<dish.length; i++){
             
              const result = objectMapper(dish[i], map);
              results.push(result);
             

            }
            return res.send(results);
           
          }

        });

      }
    });

  } catch (e) {
    res.json('Error get category');
  }
});

// Get all cuisines
router.get('/cuisines', Guard, async (req, res) => {

  try {

    await Cuisine.find({}, function (err, cuisines) {

      
      const map = {
              
        "_id": "id",      
        "title": "title",        
        "icon_id": [
          {
            key: "icon_id",
            transform: function (value) {
              let str="";
              for (let i = 0; i < value.length; i++) {

                if(i === 0){
                 
                 
                
                str+= value[i];
              } else{
                
                
                
                str+= ", " + value[i];

              }
              }
              return str;
            }
          }
        ],
                    
        "title_lc": "title_lc",    
        "last_updated": "last_updated",
        "version": "version",
      


      }

      const results = [];
    
      for(let i=0; i<cuisines.length; i++){
       
        const result = objectMapper(cuisines[i], map);
        results.push(result);
       

      }
      return res.send(results);

    });

  } catch (e) {

    res.json('Error get cuisines');

  }

});

// Get all dishes of cuisine
router.get('/cuisine/:id', Guard, async (req, res) => {

  try {
    await Cuisine.findOne({ _id: req.params.id }, function (err, cuisine) {

      if (err) {
        res.status(404).json(err);
      }
      else {
        Dish.find({ cuisine_id: req.params.id }, function (err, dishes) {
          if (err) {
            res.json('Error get dishes')

          } else {
           

            const map = {
              
              "_id": "id",
              "category_id": "category_id",
              "cuisine_id": "cuisine_id",
              "title": "title",
              "description": "description",       
              "photo_id": [
                {
                  key: "photo_id",
                  transform: function (value) {
                    let str="";
                    for (let i = 0; i < value.length; i++) {

                      if(i === 0){
                       
                     
                      
                      str+= value[i];
                    } else{
                      
                      
                      
                      str+= "," + value[i];
  
                    }
                    }
                    return str;
                  }
                }
              ],
              "source": "source", 
              "alternative": "alternative",                       
              "title_lc": "title_lc",
              "description_lc": "description_lc",
              "source_lc": "source_lc", 
              "alternative_lc": "alternative_lc",             
              "last_updated": "last_updated",
              "version": "version",
      
            }

            const results = [];
          
            for(let i=0; i<dishes.length; i++){
             
              const result = objectMapper(dishes[i], map);
              results.push(result);
             

            }
            return res.send(results);
          }


        });

      }
    });

  } catch (e) {
    res.json('Error get cuisine');
  }
});


// Get dish {id}
router.get('/dish/:id', Guard, async (req, res) => {

  try {
    await Dish.findOne({ _id: req.params.id }, function (err, dish) {

      if (err) {
        res.status(404).json(err);
      }
      else {
       
        const map = {
              
          "_id": "id",
          "category_id": "category_id",
          "cuisine_id": "cuisine_id",
          "title": "title",
          "description": "description",  
          "photo_id": [
            {
              key: "photo_id",
              transform: function (value) {
                let str="";
                for (let i = 0; i < value.length; i++) {
  
                  if(i === 0){
                  
                  str+= value[i];
                } else{    

                  str+= "," + value[i];

                }
                }
                return str;
              }
            }
          ],    
         
          "source": "source", 
          "alternative": "alternative",                    
          "title_lc": "title_lc",
          "description_lc": "description_lc",
          "source_lc": "source_lc", 
          "alternative_lc": "alternative_lc", 
          "last_updated": "last_updated",
          "version": "version",  
        }

        const result = objectMapper(dish, map);
        res.send(result);
      
      }
    });

  } catch (e) {
    res.json('Error get cuisine');
  }
});


// Get all dishes
router.get('/dish', Guard, async (req, res) => {

  try {
    await Dish.find({}, function (err, dish) {

      if (err) {
        res.status(404).json(err);
      }
      else {
       
        const map = {
              
          "_id": "id",
          "category_id": "category_id",
          "cuisine_id": "cuisine_id",
          "title": "title",
          "description": "description",  
          "photo_id": [
            {
              key: "photo_id",
              transform: function (value) {
                let str="";
                for (let i = 0; i < value.length; i++) {
  
                  if(i === 0){
                  
                  str+= value[i];
                } else{    

                  str+= "," + value[i];

                }
                }
                return str;
              }
            }
          ],    
         
          "source": "source", 
          "alternative": "alternative",                     
          "title_lc": "title_lc",
          "description_lc": "description_lc",
          "source_lc": "source_lc", 
          "alternative_lc": "alternative_lc",                     
          "last_updated": "last_updated",
          "version": "version",  
        }

        const results = [];
    
        for(let i=0; i<dish.length; i++){
         
          const result = objectMapper(dish[i], map);
          results.push(result);
         
  
        }
        return res.send(results);
      
      }
    });

  } catch (e) {
    res.json('Error get cuisine');
  }
});

module.exports = router;


