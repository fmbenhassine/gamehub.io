var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

/* display game. */
router.get('/game/:id', function(req, res) {
    var id = req.params.id;
    mongoose.model('Game').findById(id, function(err, game) {
        if(err) {
            res.status(500).end();
        }
        if (game == null){
            res.status(404).end();
        } else {
            res.send(game);
        }
    });
});

/* display user. */
router.get('/user/:name', function(req, res) {
    var name = req.params.name;
    mongoose.model('User').findOne({name: name}, function(err, user) {
        if(err) {
            res.status(500).end();
        }
        if (user == null){
            res.status(404).end();
        } else {
            res.send({
                id: user._id,
                name: user.name,
                email: user.email,
                lastConnection: user.lastConnection
            });
        }
    });
});

/* api status, for monitor */
router.get('/', function(req, res) {
    res.status(200).end();
});

module.exports = router;