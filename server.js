var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var baseDir = __dirname;

http.createServer(function (req, res) {

  try{
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
  catch(e){
    res.writeHead(500);
    res.end();
    console.log(e.stack);
  }

}).listen(3000);