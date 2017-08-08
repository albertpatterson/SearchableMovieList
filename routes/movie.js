var express = require('express');
var router = express.Router();
// var mockDatabaseService = require('../service/mockDatabaseService');
var mockDatabaseService = require('../service/dynamodbDatabaseService');


// handle get request for movies whose titles match a search query 
router.get('/', function(req, res, next) {
    let query = req.query.query;
    mockDatabaseService.getMatches(query)
    .then((matches)=>res.send(matches.Items.map(o=>o.title)))
    .catch((err)=>res.status(500).send(err))
});

module.exports = router;
