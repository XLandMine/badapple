var http = require('http');

function start(router,handle){
	http.createServer(function (req, res) {
		
		router(handle,req.url,res);
	    
	}).listen(3000, "127.0.0.1");
	console.log('Server running at http://127.0.0.1:'+3000+'/');
}

exports.start = start;