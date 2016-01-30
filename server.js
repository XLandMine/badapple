var http = require('http');

function start(router){
	http.createServer(function (req, res) {
		
		router(req.url,res);
	    
	}).listen(8888, "127.0.0.1");
	console.log('Server running at http://127.0.0.1:'+8888+'/');
}



exports.start = start;