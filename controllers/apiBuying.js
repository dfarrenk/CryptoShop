const routes = require("express").Router();
console.log("apiBying controller: \x1b[32mloaded!\x1b[0m");
const eBay = require("../lib/eBay.js");
const coinbase = require("../lib/coinbase.js")();
const CRUD = require("../lib/CRUD.js")
module.exports = function() {
	
	routes.post("/buyItem/", (req, res)=>{
		console.log("buyItem route fires!");
		let ObjectToPush = {
			currency: "USD",
			amountRecieved: 10,
			btcAddress:req.body.btcAddress,
			mailAddress: req.body.mailAddress,
			ebayId:req.body.ebayId
		}
		res.status(200).send(CRUD.updatePush("5a676d898bc3332d3047e5fa", ObjectToPush));
		
	}); 

	routes.get("/test", (req, res)=>{
		let temp =null;
		coinbase.getAddress((address)=>{
			res.send(address)
		});
	})

	return routes;
}