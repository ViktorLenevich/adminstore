var mongoose = require('mongoose');

const dbURI = 'mongodb://localhost:27017/webadmin';
mongoose.connect(dbURI, { useNewUrlParser: true });
mongoose.connection.on('connected', function() {
    console.info("Mongoose connected to: " +dbURI);
});

mongoose.connection.on('error', function() {
    console.info("Mongoose connected error: " +dbURI);
});

 

module.exports = mongoose;