var mongoose = require('mongoose');

var dishSchema = new mongoose.Schema({
   
   
    category_id: {
        type: String,
        ref: 'Category',
        default: ''

    },
    cuisine_id: {
        type: String,
        ref: 'Cuisine',
        default: ''
    },
    title: {
        type: String,
        default: 'title'
    },
    description: {
        type: String,
        default: 'description'
    },
    photo_id: {
        type: [String],
       

    },
    source: {
        type: String,
        default: 'source'
    },
    alternative: {
        type: String,
        

    },
    title_lc: {
        type: String,
        lowercase: true
    },
    description_lc: {
        type: String,
        lowercase: true
    },
    source_lc: {
        type: String,
        lowercase: true
    },
    alternative_lc: {
        type: String,
        lowercase: true

    },
    last_updated: String,
    version: {
        type: Number,
        default: 0
    }
}, {
        versionKey: false,
       

    });




dishSchema.pre('save', function (next) {



   
    this.last_updated = Date.now();
    this.title_lc = this.title.toLowerCase();
    this.description_lc = this.description.toLowerCase();
    this.source_lc = this.source.toLowerCase();
    
   
    next();
});




module.exports = mongoose.model('Dish', dishSchema);
