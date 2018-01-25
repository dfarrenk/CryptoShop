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
	routes.get("/test/:id/:price", (req, res)=>{
		console.log("Test route fires");
		console.log("Buy item: "+ req.params.id + ", quantity: 1, price:" + req.params.price)
		var soapOptions = {
			uri: 'https://api.sandbox.ebay.com/ws/api.dll',
			headers: {
				"X-EBAY-API-SITEID":0,
				"X-EBAY-API-COMPATIBILITY-LEVEL":967,
				"X-EBAY-API-CALL-NAME":"PlaceOffer"
			},
			method: 'POST',
			body: '<?xml version="1.0" encoding="utf-8"?> <PlaceOfferRequest xmlns="urn:ebay:apis:eBLBaseComponents"> <!-- This call works only in Sandbox. To use this call in Production, the APPID needs to be whitelisted--> <RequesterCredentials> <eBayAuthToken>AgAAAA**AQAAAA**aAAAAA**YS1pWg**nY+sHZ2PrBmdj6wVnY+sEZ2PrA2dj6wFk4GpCJOEogydj6x9nY+seQ**mHQEAA**AAMAAA**cK71cEmLWlqVEVsDKA7r5hwPbjj6l8I8BDLuCuXvBMulKHN3b2pogiRahTHRx1xV3G+LAff66fdx/IZOC8KM8c/sJM+7VhKnAxWuBA1LnEbVm5kxNYcHCykR94QFbnMbGLOW5xjZ6D3bd+0LVjjYfh4uvNF5Lj1b3GeNhyYKnAYAfNVy7Ueb0+PBByizynGLB1CBf1rYU9+gBl4jVXRUGxXgyKfOqekKG5CM+6xTVEZjYQoX5/CB6gYKkcO4jQ/1ArvSVwbYp+ld1I6Qsqv2ZfUvPN8AS0Q51XS6p0OCVQEd+QF/I2PNvghr/HioGDb7Ie/SLINDXVPt7LyM5xHOSS4GHT/5rZfm43WAA1Az3xV/dI+Wyx7LKD6kOhcBRQyRFYd9T2bEvfd9npRdjCCpxT5FlGwZ6qxtS14420jv85MfW18VFOz5R96NGLyIMMO43aXBKi1gDhoskkh9FDpC1GbHAGloacBOXw+8sCtoO3PVloW+IVUBGaKRBqxFOnE3toeZSauSXvJ19i5GtMIR8cEVHIWK9CR4M//cQje9WhFs4Usj4EJD7KFWmfwOht/VQY+OAYOirMRDFZQ2GHFtDicdXPXKX3EURybPWjx+S7PQ6MoHwUZWhpE7/CMGVi8lKiUBTcveKV9DI5bodJt6ZbT0sWgN1ydS+YBz0iqX4W87fX0hufnWNLekG378RsV9GOERoCi2T5vJYo5xt6UB1LsdlHBjXjjIeAa+cPvtr/yH4H14DDfRThrFuVgGNw+D</eBayAuthToken> </RequesterCredentials> <ErrorLanguage>en_US</ErrorLanguage> <WarningLevel>High</WarningLevel> <!--Enter the IP address--> <EndUserIP>66.26.136.160</EndUserIP> <!--Enter the ItemID that you want to buy--> <ItemID>'+req.params.id+'</ItemID> <Offer> <Action>Purchase</Action> <Quantity>1</Quantity> <MaxBid currencyID="USD">'+req.params.price+'</MaxBid> </Offer> </PlaceOfferRequest>'  
		}
		request(soapOptions, function(err, response) {
			if(err){
				console.log(err);
			}
			res.send(response.statusCode);
		})

	});

	return routes;
}