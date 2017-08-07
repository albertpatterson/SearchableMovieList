var express = require('express');
var router = express.Router();
const fs = require('fs');

var movies;

/**
 * get the movies whose titles match the search query
 * 
 * @param {string} query 
 * @returns string[] titles of movies matching the qery
 */
function getMatches(query){
    let searchStr = ".*"+query.replace(/\s/,".*")+".*";
    var regexp = new RegExp(searchStr,"i");
    return movies.filter(movie=>movie.match(regexp));
}


// handle get request for movies whose titles match a search query 
router.get('/', function(req, res, next) {
    let query = req.query.query;
    if(movies){
        res.send(getMatches(query));
    }else{
        fs.readFile("./data/movieTitles.json", function(err, data){
            movies = JSON.parse(data);
            res.send(getMatches(query));
        })
    }
});

module.exports = router;
