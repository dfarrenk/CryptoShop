const routes = require("express").Router();
const request = require("request");
console.log("eBay controller: \x1b[32mloaded!\x1b[0m");

module.exports = function() {
	/*
	this route 
	1)it should check BTC-transaction (more than 4 confirmations)
	2) get eBay item number
	3) buy it using coinbase or bitpay credentials
	3.1) checkoutsessionid
	3.2)updatepaymentinfo with credticard info (otherwise it will try to use paypal)
	*/
	let options = {
		headers: {
			"X-EBAY-API-SITEID":0,
			"X-EBAY-API-COMPATIBILITY-LEVEL":967,
			"X-EBAY-API-CALL-NAME":"PlaceOffer"
		}
	};

	routes.get("/buyItem/:ID", (req, res)=>{
		console.log("buyItem route fires!");
		options.url = 'https://api.sandbox.ebay.com/buy/browse/v1/item/get_item_by_legacy_id?legacy_item_id='+req.params.ID;
		//ensure that there is such item
		request(options, function (error, response, body) {
			if (error) {
				console.log(error);
			} // Print the error if one occurred
			//console.log('statusCode:', response && response.statusCode);  
			res.status(200).send(body) ;
			
		});
	}); 

	routes.get("/findItems/:query/:limit", (req, res)=>{
		console.log("find items route fires!");
		options.url = `https://api.sandbox.ebay.com/buy/browse/v1/item_summary/search?q=${req.params.query}&limit=${req.params.limit}`;
		request(options, function (error, response, body) {
			console.log(req.params.query)
			if (error) {
				console.log(error);
			} // Print the error if one occurred
			//console.log('statusCode:', response && response.statusCode);  
			res.status(200).send(body) ;
			
		});
	});

	//initiate checkout session
	function initiateCheckOutSession(itemId, quantity){
		options.url = "https://api.sandbox.ebay.com/buy/order/v1/checkout_session/initiate";
		let requestBody = {
			"shippingAddress": {
				"addressLine1": "2025 Hamilton Ave.",
				"city": "San Jose",
				"stateOrProvince": "CA",
				"postalCode": "95125",
				"country": "US",
				"recipient": "Frank Smith",
				"phoneNumber": "617 555 1212"
			}
			,"lineItemInputs": [{"quantity": quantity, "itemId": itemId}]
		}
		options.form = requestBody;
		request.post(options, (error, response, body)=>{
			console.log(body);
			if(error){
				throw error;
			}
			
		});
	}
	routes.get("/test/:id", (req, res)=>{
		console.log("test route runs");
		initiateCheckOutSession(req.params.id, 1);
		res.status(200);
	});

	return routes;
}