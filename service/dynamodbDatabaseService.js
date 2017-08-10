// instance of AWS configured with appropriate credentials
const AWS = require('../private/AWSConfigService');

var docClient = new AWS.DynamoDB.DocumentClient();

/**
 * get the movie titles that match a search query
 * 
 * @param {any} query 
 * @returns 
 */
function getMatches(query){
    
    const queryStrings = query.replace(/[\s\W]{1,}/g," ").split(" ");
    const nStrings = queryStrings.length;

    var expr = "";
    var attrVals = {};
    
    for(var idx=0; idx<nStrings; idx++){
        let attr = (":s"+idx);
        let contState = `contains(#t, ${attr})`;
        expr += (idx<(nStrings-1)) ? contState + " and " : contState;
        attrVals[attr] = queryStrings[idx];
    }

    queryParams = {
        TableName: "MovieTitles",
        FilterExpression: expr,
        ExpressionAttributeNames: {
            "#t": "title"
        },
        ExpressionAttributeValues: attrVals
    }

    return new Promise(function(res, rej){
        docClient.scan(queryParams, (err, data)=>{ 
            if(err){
                console.log('err ', err);
                rej(err)
            }else{
                console.log('data ', data);
                console.log('items ', data.Items);
                let titles = data.Items.map(item=>item.title);
                console.log('titles ', titles);
                res(titles); 
            }
        })
    }.bind(this))
}

module.exports.getMatches = getMatches;