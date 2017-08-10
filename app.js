var http = require('http');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
const movie = require('./routes/movie');
const fs = require('fs');

// instance of AWS configured with appropriate credentials
const AWS = require('./private/AWSConfigService');

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




// server.listen(port);
// initialize DB and start server
const dynamodb = new AWS.DynamoDB();

new Promise((res, rej)=>{
  dynamodb.listTables({}, (err, data)=>{
    err ? rej(err) : res(data);
  })
}).then((tableData)=>{
  console.log('tables are ', tableData.TableNames)
  // if(tableData.TableNames.indexOf("MovieTitles")===-1){
  //   return createMovieTitlesTable();
  // }
  return createMovieTitlesTable(tableData.TableNames.indexOf("MovieTitles")===-1)
})
// Promise.resolve()
.then(function(){
  server.listen(port);
})
.catch(function(err){
  console.log(err);
})



/**
 * Create the table containing some movie titles
 * 
 * @returns 
 */
function createMovieTitlesTable(doCreate){

  let creationPromise;

  if(doCreate){
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

    creationPromise =  new Promise((res, rej)=>{
      dynamodb.createTable(dbparams, (err, data)=>{
        console.log('create table');
        console.log('err ', err);
        console.log('data ', data);
        err ? rej(err) : res(data);
      })
    })
  }else{
    creationPromise=Promise.resolve()
  }

  creationPromise
  .then((data)=>{
    return new Promise((res, rej)=>{
      fs.readFile("./data/movieTitles.json", (err, data)=>{
        console.log('read data');
        console.log('err ', err);
        console.log('data ', data);
        err ? rej(err) : res(JSON.parse(data));
      })
    })
  })
  .then((titles)=>{
    console.log('add data');
    console.log('titles ', titles);

    const n = 2000;
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
                console.log('err ', err)
                rej(err);
              }else{
                console.log('added '+title);
                res(data);
              }
            })
        })
      });
      return Promise.all(putProms);
    });
}