var mongoose = require('mongoose');
var util = require('../config/util.js');

var UserSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    lastConnection: { type: Date, default: Date.now }
});

UserSchema.methods = {

    authenticate: function (plainText) {
        return util.encrypt(plainText) == this.password;
    }

};

mongoose.model('User', UserSchema);