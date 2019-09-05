var mongoose = require('mongoose');

//const dbURI = 'mongodb+srv://VictorDev:Z1rykvVo@admindb-6u5as.mongodb.net/test?retryWrites=true&w=majority';
const dbURI = 'mongodb+srv://VictorDev:Z1rykvVo@admindb-6u5as.mongodb.net/test?retryWrites=true&w=majority';
var dbOptions = {
    user: 'VictorDev',
    pass: 'Z1rykvVo',
    useNewUrlParser: true
};

mongoose.connect(dbURI, dbOptions);

mongoose.connection.on('connected', function() {
    console.info("Mongoose connected to: " + dbURI);
});

mongoose.connection.on('error', function() {
    console.info("Mongoose connected error " + dbURI);
});
 

module.exports = mongoose;