const fs = require('fs');

var movies;

/**
 * get the movies whose titles match the search query
 * 
 * @param {string} query 
 * @returns string[] titles of movies matching the qery
 */
function getMatches(query){
    return new Promise((res, rej)=>{
        if(movies){
            let searchStr = ".*"+query.replace(/\s/,".*")+".*";
            var regexp = new RegExp(searchStr,"i");
            res(movies.filter(movie=>movie.match(regexp)));
        }else{
            fs.readFile("./data/movieTitles.json", function(err, data){
                movies = JSON.parse(data);
                err ? rej(err) : res(getMatches(query));
            })
        }
    })
}


module.exports.getMatches = getMatches;