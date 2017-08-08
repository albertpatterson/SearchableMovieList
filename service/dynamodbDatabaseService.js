const AWS = require('aws-sdk');

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

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

    console.log(queryParams);

    return new Promise(function(res, rej){
        docClient.scan(queryParams, (err, data)=>{ err? rej(err) : res(data); })
    }.bind(this))
}

module.exports.getMatches = getMatches;