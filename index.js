var server = require("./server");
var router = require("./router");
var requestHandle = require("./requestHandle");

var handle = [];
handle["/"] = requestHandle.start;
handle["/start"] = requestHandle.start;
handle["/download"] = requestHandle.download;

server.start(router.router,handle);