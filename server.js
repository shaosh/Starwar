var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var baseDir = __dirname;

var StarwarConstants = require('./js/constants/StarwarConstants');
var Lokka = require('lokka').Lokka;
var Transport = require('lokka-transport-http').Transport;
var client = new Lokka({
  transport: new Transport(StarwarConstants.Urls.SWAPI)
});

http.createServer(function (req, res) {
  try{
    if(req.url === '/swapiProxy'){
      GetDataFromSwapi(res);
    }
    else{
      var requestUrl = url.parse(req.url);
      var fsPath = baseDir + path.normalize(requestUrl.pathname);
      res.writeHead(200);

      var fileStream = fs.createReadStream(fsPath);
      fileStream.pipe(res);
      fileStream.on('error',function(e) {
        res.writeHead(404);
        res.end()
      });
    }
  }
  catch(e){
    res.writeHead(500);
    res.end();
    console.log(e.stack);
  }
}).listen(3000);

var GetDataFromSwapi = function(res){
  var vars = null;
  var query = StarwarConstants.Queries.CHARACTER;
  var data = client.cache.getItemPayload(query, vars);
  if(!data){
    client.query(query).then(
      function(result){
        if(result.allFilms){
          client.cache.setItemPayload(query, vars, result);
          res.writeHead(200, { 'Content-Type': 'application/json', "Access-Control-Allow-Origin":"*" });
          res.write(JSON.stringify(result));
          res.end();
        }
        else{
          res.writeHead(500);
          res.end();
        }
      },
      function(error){
        res.writeHead(500);
        res.end();
      }
    )
  }
  else{
    res.writeHead(200, { 'Content-Type': 'application/json', "Access-Control-Allow-Origin":"*" });
    res.write(data);
    res.end();
  }
};