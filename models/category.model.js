var mongoose = require('mongoose');

var categorySchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    title: {
        type: String,
        require: true,
        default: "Category"
    },
    icon_id: {
        type: [String],
        default: ''
       
    },
    title_lc: {
        type: String,
        lowerCase: true
    },
    last_updated: String
}, {
    versionKey: false,
  
});

categorySchema.pre('save', function(next) {
    this._id = mongoose.mongo.ObjectId();
    this.last_updated = Date.now();
    this.title_lc = this.title.toLowerCase();
    next();

});

module.exports = mongoose.model('Category', categorySchema);