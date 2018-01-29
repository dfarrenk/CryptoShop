var Client = require('coinbase').Client;
var client = new Client({
	'apiKey': process.env.COINBASE_API_KEY,
	'apiSecret': process.env.COINBASE_API_SECRET,
	'version':'2017-05-11'
});
console.log("Coinbase config file: \x1b[32mloaded!\x1b[0m");
module.exports = client;