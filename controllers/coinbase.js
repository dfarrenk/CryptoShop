const routes = require("express").Router();
const client = require("../config/coinbase.js");
console.log("Coinbase controller: \x1b[32mloaded!\x1b[0m");

module.exports = function() {
	//this route should create a new coinbase bitcoin address, and send this back to client side
	//where script will create a payment button using generated address. Funds will go directly
	//to primary BTC coinbase wallet.
	routes.post("/getAddress", (req, res)=>{
		console.log("getTransaction route fires!");
		
		client.getAccount('primary', function(err, account) {
			//it looks strange, but we have to keep it before we coinbase will activate API-key
			if (err){
				console.error("Error:" + err.message);
				res.send(err.message);
			}else{
				account.createAddress(null, function(err, rObject) {					

					console.log("The new address is" +rObject.address);
					res.send(rObject.address);
				});
			}
		});
	});

	routes.get("/test", (req,res)=>{
		
		/*
		const parametrs = {
			"amount": "10.00", 
			"currency": "USD", 
			"name": "Order #123",
			"description": "Sample order",
			"metadata": {
				"customer_id": "id_1005",
				"customer_name": "Satoshi Nakamoto"
				}
			}

		client.createOrder(parametrs, function(error, order) {
				if(error){
					throw(error);
				}
				console.log(order);
		});
		*/

		client.getAccount('primary', function(err, account) {
			//it looks strange, but we have to keep it before we coinbase will activate API-key
			if (err){
				console.error("Error:" + err.message);
				res.send(err.message);
			}else{				
				account.getTransactions(null,function(err, txs) {
					let objectToDisplay = [];
					txs.map((data)=>{
						objectToDisplay.push({
							"id":data.id,
							"amount": data.amount.amount,
							"createdAt": data.created_at,
							"status": data.status
						});
					});
					res.send(objectToDisplay);
				});
			}
		});
	});

	return routes;
}