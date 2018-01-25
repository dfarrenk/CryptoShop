const routes = require("express").Router();
const client = require("../config/coinbase.js");

module.exports = function() {
	//this route should create a new coinbase bitcoin address, and send this back to client side
	//where script will create a payment button using generated address. Funds will go directly
	//to primary BTC coinbase wallet.

	const objectToExport = {};

	//this function will get new primary BTC wallet address every time when you call it (this is coinbase suggestion)
	objectToExport.getAddress = ()=>{
		console.log("getAddress() fires!");
		let newAddress = null;
		client.getAccount('primary', function(err, account) {
			//it looks strange, but we have to keep it before we coinbase will activate API-key
			if (err){
				console.error("Error:" + err.message);
				res.send(err.message);
			}else{
				account.createAddress(null, function(err, rObject) {					

					console.log("The new address is" +rObject.address);
					newAddress= rObject.address;
				});
			}
		});
		return newAddress;
	}

	routes.get("/test", (req,res)=>{

		client.getAccount('primary', function(err, account) {
			//it looks strange, but we have to keep it before we coinbase will activate API-key
			if (err){
				console.error("Error:" + err.message);
				res.send(err);
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

	return objectToExport;
}

console.log("Coinbase controller: \x1b[32mloaded!\x1b[0m");