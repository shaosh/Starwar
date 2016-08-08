var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var querystring = require('querystring');
var baseDir = __dirname;

var StarwarConstants = require('./js/constants/StarwarConstants');
var Lokka = require('lokka').Lokka;
var Transport = require('lokka-transport-http').Transport;
var client = new Lokka({
  transport: new Transport(StarwarConstants.Urls.SWAPI)
});

http.createServer(function (req, res) {
  try{
    var requestUrl = url.parse(req.url);
    var pathname = path.normalize(requestUrl.pathname);
    if(pathname.indexOf('swapiProxy') > -1){
      var query = requestUrl.query;
      if(query){
        GetDataFromSwapi(res, unescape(query));
      }
    }
    else{
      var fsPath = baseDir + pathname;
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

var GetDataFromSwapi = function(res, query){
  var vars = null;
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
        res.writeHead(502);
        res.end();
      }
    )
  }
  else{
    res.writeHead(200, { 'Content-Type': 'application/json', "Access-Control-Allow-Origin":"*" });
    res.write(JSON.stringify(data));
    res.end();
  }
};