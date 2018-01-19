const someRoute = require("express").Router();

module.exports = function() {

	// var Client = require('coinbase').Client;
	// var client = new Client({
	// 	'apiKey': 'API KEY',
	// 	'apiSecret': 'API SECRET',
	// 	'version':'YYYY-MM-DD'
	// });

	// client.getAccounts({}, function(err, accounts) {
	// 	accounts.forEach(function(acct) {
	// 		console.log(acct.name + ': ' + acct.balance.amount + ' ' + acct.balance.currency);
	// 		acct.getTransactions(null, function(err, txns) {
	// 			txns.forEach(function(txn) {
	// 				console.log('txn: ' + txn.id);
	// 			});
	// 		});
	// 	});
	// });

	// client.createAccount({'name': 'New Wallet'}, function(err, acct) {
	// 	console.log(acct.name + ': ' + acct.balance.amount + ' ' + acct.balance.currency);
	// });




	return someRoute;
}