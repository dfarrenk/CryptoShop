const routes = require("express").Router();
console.log("apiBying controller: \x1b[32mloaded!\x1b[0m");

const eBay = require("../lib/eBay.js");
const coinbase = require("../lib/coinbase.js")();
module.exports = function() {
	
	routes.post("/buyItem/", (req, res)=>{
		console.log("buyItem route fires!");
		
		request(options, function (error, response, body) {
			if (error) {
				console.log(error);
			} // Print the error if one occurred
			//console.log('statusCode:', response && response.statusCode);  
			res.status(200).send(body) ;
			
		});
	}); 

	routes.get("/test", (req, res)=>{
		let temp =null;

		temp = coinbase.getAddress();
		res.status(200).send(temp)
	})

	return routes;
}