const client = require("../config/coinbase.js");
const DEBUG = process.env.NODE_ENV == "development";

/*
Important note: I use client.getAccount every time in each function, 
because I want to be sure what I will get working wallet-object
and nothing happened on Coinbase servers,
In another case if I will use getAccount only one time during file requiring,
and something will happens on Coinbase, I will have to restart whole server, instead of trying to access function 
one more time
*/

module.exports = function() {
	//this route should create a new coinbase bitcoin address, and send this back to client side
	//where script will create a payment button using generated address. Funds will go directly
	//to primary BTC coinbase wallet.

	const objectToExport = {};

	//this function will get new primary BTC wallet address every time when you call it (this is coinbase suggestion)
	//also we have to pass callback in order to be able to get address in another modules, because we cannot use "return"
	//from async functions
	objectToExport.getAddress = (cb)=>{
		DEBUG && console.log("\x1b[32mDEBUG: \x1b[0mgetAddress() fires!");
		client.getAccount('primary', function(err, account) {
			if (err){
				console.error("Error:" + err.message);
				return "getAddress: Error: "+ err.message;
			}else{
				account.createAddress(null, function(err, rObject) {
					console.log("The new address is " + rObject.address);
					cb(rObject.address);
				});
			}
		});		
	};

	objectToExport.checkTransaction = (addressBTC, cb)=>{
		DEBUG && console.log("\x1b[32mDEBUG: \x1b[0mCheck Transaction " + addressBTC);
		client.getAccount('primary', function(err, account) {
			account.getAddress(addressBTC, function(err, address) {
				if(err){
					console.log(err)
				}else{
					address.getTransactions({}, function(err, txs) {
						cb(txs);
					});
				}				
			});
		});
		
	}

	return objectToExport;
}

console.log("Coinbase controller: \x1b[32mloaded!\x1b[0m");