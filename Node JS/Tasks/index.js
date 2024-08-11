var http = require('http');
var aa = require('./module');
 http.createServer(function(req,res){
    res.writeHead(402,{'codntentType':'text/html'});
    res.write("Date: "+aa.myDateTime());
    res.end();
 }).listen(8080);

