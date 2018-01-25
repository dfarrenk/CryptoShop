const routes = require("express").Router();
console.log("apiBying controller: \x1b[32mloaded!\x1b[0m");

module.exports = function() {
	

	routes.get("/test", (req,res)=>{
		
	});

	return routes;
}