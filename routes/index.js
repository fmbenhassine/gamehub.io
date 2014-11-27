var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var util = require('../config/util.js');
var User = mongoose.model('User');

var router = express.Router();

router.get('/', function(req, res) {
   mongoose.model('Quote').find({}, function(err, quotes) {
        var randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        mongoose.model('Puzzle').find({}, function(err, puzzles) {
           var randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
           var logoutSuccessMessage = req.flash('logoutSuccess');
           var welcomeMessage = req.flash('welcomeMessage');
           var registerSuccessMessage = req.flash('registerSuccessMessage');
           res.render('partials/index', {
               title: 'Chess Hub',
               quote: randomQuote,
               puzzle: randomPuzzle,
               logoutSuccessMessage: logoutSuccessMessage,
               welcomeMessage: welcomeMessage,
               registerSuccessMessage: registerSuccessMessage,
               user: req.user,
               isHomePage: true
           });
       });
    });
});

router.get('/game/:token/:side', function(req, res) {
    var token = req.params.token;
    var side = req.params.side;
    res.render('partials/game', {
        title: 'Chess Hub - Game ' + token,
        user: req.user,
        isPlayPage: true,
        token: token,
        side: side
    });
});

router.get('/logout', function(req, res) {
    req.logout();
    req.flash('logoutSuccess', 'You have been successfully logged out');
    res.redirect('/');
});

router.get('/tv', function(req, res) {
    res.render('partials/tv', {
        title: 'Chess Hub - Tv',
        user: req.user,
        isTvPage: true,
        opponent1: 'V. Anand',
        opponent2: 'G. Kasparov'
    });
});

router.get('/monitor', function(req, res) {

    /*todo : ping services (mongo, elasticsearch and api) and populate status
    http.get("http://localhost:3000/api", function(res) {
        var apiStatus = res.statusCode === 200;
        var mongoStatus = mongoose.connection.modelNames().length === 0;
        // render monitor page
    })*/
    var mongoStatus = "success", mongoIcon = "smile";
    var apiStatus = "success", apiIcon = "smile";
    var esStatus = "success", esIcon = "smile";
    res.render('partials/monitor', {
        title: 'Chess Hub - Monitor',
        user: req.user,
        status: {
            mongo: mongoStatus,
            api: apiStatus,
            es: esStatus
        },
        icon: {
            mongo: mongoIcon,
            api: apiIcon,
            es: esIcon
        }
    });
});

module.exports = router;
