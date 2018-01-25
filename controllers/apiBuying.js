const routes = require("express").Router();
console.log("apiBying controller: \x1b[32mloaded!\x1b[0m");
const eBay = require("../lib/eBay.js");
const coinbase = require("../lib/coinbase.js")();
const CRUD = require("../lib/CRUD.js");
const { "token-timeout": expiredIn } = require("../config/config.json");

//DONE: user go to search page
//DONE: select item
//DONE: click Payment
//DONE: click Submit (list the order)
//DONE: the script will send object to /buyItem route
//TODO: buyItem route will start checking the current transaction on our wallet 
//TODO: once we will get transaction - server will break checking function,
//TODO: server will purchase the item what user wants, and write it in the database
//TODO: eBay will send the item to customer 下 卞 巃 籠 嚨 櫳 瓏

module.exports = function() {
	
	routes.post("/buyItem/", (req, res)=>{
		console.log("buyItem route fires!");
		let 下 = {
			"currency": "USD",
			"amountRecieved": 10,
			"btcAddress":req.body.btcAddress,
			"mailAddress": req.body.mailAddress,
			"ebayId":req.body.ebayId
		};
		res.status(200).send(CRUD.updatePush("5a6a38d89f817930d8ed2d93", { "orders":下 })
			.then(data => {
				return signToken(req, data, expiredIn);
			}));
	}); 

	routes.get("/test", (req, res)=>{
		let temp =null;
		coinbase.getAddress((address)=>{
			res.send(address);
			const { _id, username } = req.user;
			const Userinfo = req.session[_id];
		});
	})

	return routes;
}