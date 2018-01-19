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
				err.message == "API Key disabled" && console.log("\x1b[32mEverything is fine, we have to wait 48 hours since 1/18/18 for API key activation\x1b[0m");
				res.send("API disabled: test passed!");
			}else{
				account.createAddress(function(err, addr) {					
					accounts.forEach(function(acct) {
						console.log(acct.name + ': ' + acct.balance.amount + ' ' + acct.balance.currency);
						acct.getTransactions(null, function(err, txns) {
							txns.forEach(function(txn) {
								console.log('txn: ' + txn.id);
							});
						});
					});
					console.log("The new address is" +addr);
					res.send(addr);
				});
			}
		});
	});

	// this is not necessary for us
	// client.createAccount({'name': 'New Wallet'}, function(err, acct) {
	// 	console.log(acct.name + ': ' + acct.balance.amount + ' ' + acct.balance.currency);
	// });

	return routes;
}