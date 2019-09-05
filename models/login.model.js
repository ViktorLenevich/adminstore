var config = require('./../config/config.json');

var admin = {
    login: config.login,
    password: config.password
};

module.exports = admin;