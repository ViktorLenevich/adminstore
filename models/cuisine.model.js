var mongoose = require('mongoose');

var cuisineSchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
   
    icon_id: {
        type: [String],
        default: ''
       
    },
    title: {
        type: String,
        require: true,
        default: "Cuisine" 
    },
    title_lc: {
        type: String,
        lowerCase: true
    },
    version: {
        type: Number,
        default: 0

    },
    last_updated: String,
    version: {
        type: Number,
        default: 0
    }
   
}, {
    versionKey: false,
 
});

cuisineSchema.pre('save', function(next) {
    this._id = mongoose.mongo.ObjectId();
    this.last_updated = Date.now();
    this.title_lc = this.title.toLowerCase();
    next();

});

module.exports = mongoose.model('Cuisine', cuisineSchema);