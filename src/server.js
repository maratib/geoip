'use strict';
const http = require('http');
var url = require('url');
// import Circle from './Circle';
import GeoipService from './GeoipService';

const hostname = process.env.IP || '127.0.0.1';
const port = process.env.PORT || 5050;
const geo = new GeoipService();

// Lets define the server
const server = http.createServer((req, res) => {
	let path = url.parse(req.url);
	let query = url.parse(req.url, true).query;
	console.log(path.pathname);

	if (query.ip) {
		geo.getCity(query.ip, res);
	} else {
		console.log('no ip');
	}

});




// Lets start the server
server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});


