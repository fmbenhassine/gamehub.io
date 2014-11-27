var express = require('express');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client(); // default to localhost:9200

var router = express.Router();

router.get('/', function(req, res) {
    res.render('partials/search', {
        title: 'Chess Hub - Search',
        user: req.user,
        isSearchPage: true
    });
});

router.post('/', function(req, res) {
    var white = req.body.white;
    var black = req.body.black;
    var content = req.body.content;
    var result = req.body.result;

    client.search({
        index: 'chesshub',
        type: 'game',
        body: {
            "query": {
                "bool": {
                    "should": [
                        { "match": { "white":  white }},
                        { "match": { "black": black }},
                        { "match": { "content": content }},
                        { "match": { "result": result }}
                    ]
                }
            }
        }
    }).then(function (resp) {
            var games = resp.hits.hits;
            res.set('Content-Type', 'application/json');
            res.status(200);
            res.send({ games: games });
        }, function (err) {
            res.status(500);
            console.log(err);
        });
});

module.exports = router;
