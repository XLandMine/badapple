var http = require('http');

function start(router){
	var ipStr = "127.0.0.1";
	http.createServer(function (req, res) {
		router(req.url,res);
	}).listen(8888, ipStr);
	console.log('Server running at http://'+ipStr+':'+8888+'/');
}



exports.start = start;