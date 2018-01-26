const routes = require("express").Router();
console.log("apiBying controller: \x1b[32mloaded!\x1b[0m");
const eBay = require("../lib/eBay.js");
const coinbase = require("../lib/coinbase.js")();
const CRUD = require("../lib/CRUD.js");
const { "token-timeout": expiredIn } = require("../config/config.json");

//1)DONE: user go to search page
//2)DONE: select item
//3)DONE: click Payment
//4)DONE: click Submit (list the order)
//5)DONE: the script will send object to /buyItem route
//6)TODO: buyItem route will start checking the current transaction on our wallet 
//7)TODO: once we will get transaction - server will break checking function,
//8)TODO: server will purchase the item what user wants, and write it in the database
//9)TODO: eBay will send the item to customer 下 卞 巃 籠 嚨 櫳 瓏

module.exports = function() {
	routes.get("/getAddress", (req, res)=>{
		console.log("/getAddress fires!");
		coinbase.getAddress((address)=>{
			res.send(address)
		})
	})

	//5)
	routes.post("/buyItem/", (req, res)=>{

		console.log("buyItem route fires! "+ req.body.btcAddress);
		let 下 = {
			"currency": "USD",
			"amountRecieved": 10,
			"btcAddress":req.body.btcAddress,
			"mailAddress": req.body.mailAddress,
			"ebayId":req.body.ebayId
		};
		//8) check transaction every 10 seconds, 
		let counter15Min = 90;
		let transactionIntervalCheck = setInterval(()=>{
			coinbase.checkTransaction(下.btcAddress, (transaction)=>{
				if(transaction[0].status =="completed"){
					res.status(200).send(CRUD.updatePush("5a6a38d89f817930d8ed2d93", { "orders":下 })
						.then(data => {
							return signToken(req, data, expiredIn);
						}));
				}
				// const { _id, username } = req.user;
				// const Userinfo = req.session[_id];
				counter15Min--;
				if(!counter15Min){
					clearInterval(transactionIntervalCheck);
				}
			});
		},	10000);
		

	}); 

	routes.get("/test/:address", (req, res)=>{
		let temp =null;
		
	})

	return routes;
}