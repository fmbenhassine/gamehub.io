var express = require('express');
var mongoose = require('mongoose');
var util = require('../config/util.js');
var router = express.Router();
var moment = require('moment');

/* GET user account details. */
router.get('/', function(req, res) {
    res.render('partials/account', {
        title: 'Chess Hub - Account',
        user: req.user,
        isAccountPage: true,
        lastConnection: moment(req.user.lastConnection).fromNow(),
        updateStatus: req.flash('updateStatus'),
        updateMessage: req.flash('updateMessage')
    });
});

/* Update user account. */
router.post('/', function(req, res) {
    var User = mongoose.model('User');
    var currentPassword = req.body.password;
    var newPassword = req.body.newPassword;
    var confirmNewPassword = req.body.confirmNewPassword;
    var hash = util.encrypt(currentPassword);
    if ( hash === req.user.password ) {
        if ( newPassword === confirmNewPassword ) {
            var newPasswordHash = util.encrypt(newPassword);
            User.findOneAndUpdate({_id: req.user._id}, { password: newPasswordHash }, {} ,function (err, user) {
                req.user = user;
                req.flash('updateStatus', true);
                req.flash('updateMessage', 'Your password has been updated successfully');
                res.redirect('/account');
            });
        } else {
            req.flash('updateStatus', false);
            req.flash('updateMessage', 'The confirmation password does not match the new password');
            res.redirect('/account');
        }
    } else {
        req.flash('updateStatus', false);
        req.flash('updateMessage', 'The current password is incorrect');
        res.redirect('/account');
    }

});

module.exports = router;
