var fs = require("fs");

function start(res){
	console.log("将调用路径'/start'");
	res.writeHead(200, {'Content-Type': 'text/html'});
	
	fs.readFile("show.html","utf-8",function(err,data){
		if(err){
			res.end("txt err in 0 \n");
		}else{
			res.write(data);
			res.end();
		}
	});
}

function download(res){
	console.log("调用了 download ");
	res.writeHead(200, {'Content-Type': 'text/plain'});

	fs.readFile("badappleTxt.txt","utf-8",function(err,data){
		if (err) {
			res.writeHead(404, {'Content-Type': 'text/plain'});
			res.end("err");
			console.log("err");
		}else{
			res.write(data);
			res.end();
		}
	});
}

exports.start = start;
exports.download = download;