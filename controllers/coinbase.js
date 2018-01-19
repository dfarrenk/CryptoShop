const someRoute = require("express").Router();
const client = require("../config/coinbase.js");
console.log("Coinbase controller: \x1b[32mloaded!\x1b[0m");
module.exports = function() {

	client.getAccounts({}, function(err, accounts) {
		if (err) throw err;
		accounts.forEach(function(acct) {
			console.log(acct.name + ': ' + acct.balance.amount + ' ' + acct.balance.currency);
			acct.getTransactions(null, function(err, txns) {
				txns.forEach(function(txn) {
					console.log('txn: ' + txn.id);
				});
			});
		});
	});

	// client.createAccount({'name': 'New Wallet'}, function(err, acct) {
	// 	console.log(acct.name + ': ' + acct.balance.amount + ' ' + acct.balance.currency);
	// });




	return someRoute;
}