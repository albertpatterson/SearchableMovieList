var http = require('http');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
const movie = require('./routes/movie');
const fs = require('fs');

const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});


var app = express();

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/movie', movie);

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

var server = http.createServer(app);


server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}








// initialize DB and start server
const dynamodb = new AWS.DynamoDB();

const dbparams = {
    TableName : "MovieTitles",
    KeySchema: [       
        { AttributeName: "title", KeyType: "HASH"},  //Partition key
    ],
    AttributeDefinitions: [       
        { AttributeName: "title", AttributeType: "S" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

// dynamodb.

// new Promise(function(res, rej){
//   dynamodb.createTable(dbparams, function(err, data) {
//       if (err) {
//           console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
//           rej(err);
//       } else {
//           console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
//           res(data);
//       }
//   });
// }.bind(this))
// new Promise(res=>res())
Promise.resolve()
.then(function(data){
  return new Promise((res, rej)=>{
    fs.readFile("./data/movieTitles.json", (err, data)=>{
      if(err){
        rej(err);
      }else{
        res(JSON.parse(data));
      }
    })
  })
}.bind(this))
.then(function(titles){
  const n = 100;
  titles.splice(n,titles.length-n);
  let docClient = new AWS.DynamoDB.DocumentClient();
  let putProms = titles.map(function(title){
      return new Promise((res, rej)=>{
          let = putParams = {
                  TableName: "MovieTitles",
                  Item: {title}
                };
          docClient.put(putParams, (err, data)=>{
            if(err){
              rej(err);
            }else{
              console.log('added '+title);
              res(data);
            }
          })
      })
    });
    return Promise.all(putProms);
})
.then(function(){
  server.listen(port);
})
.catch(function(err){
  console.log(err);
})