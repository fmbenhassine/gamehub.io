var express = require('express');
var util = require('../config/util.js');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('partials/play', {
        title: 'Chess Hub - Game',
        user: req.user,
        isPlayPage: true,
        timeout:false,
        timeoutTime:0
    });
});

router.post('/', function(req, res) {

    var side = req.body.side;
    //var opponent = req.body.opponent; // playing against the machine in not implemented
    var token = util.randomString(20);
    var enable=req.body.enable;
    var timeout=req.body.timeout;
    if(!timeout)
        timeout=0;
    res.redirect('/game/' + token + '/' + side+'/'+timeout);
});

module.exports = router;