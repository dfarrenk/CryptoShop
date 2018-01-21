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
			Authorization:"Bearer v^1.1#i^1#f^0#p^3#r^0#I^3#t^H4sIAAAAAAAAAOVXa2wUVRTu9mWaWk0TKaiAm0GNlszuvTv7mB3Y1e2DUgKlZUsFDJZ53GkHZmfGuTNtx2izKVL++Af8gcGgDQaE8lAQEwhKxEiQaMRHQomIolF8JIYIRhJE8c72wbZE6IPEJu6fyb33vL5zvnP2XpAuLCrvnt99ucRzR25PGqRzPR5YDIoKC2bflZd7X0EOyBLw9KQfTOd35f00F/Mp1eCWIGzoGkbejpSqYS6zGaNsU+N0HiuY0/gUwpwlcsnEooVcwAc4w9QtXdRVyltbFaOCEIooGAkKgIdMQODJrjZos1GPUZEogySJEQNIhoKMguQcYxvVatjiNStGBQBkaQDpAGyELBdkORj2wUBoBeVtQiZWdI2I+AAVz4TLZXTNrFhvHiqPMTItYoSK1ybmJRcnaquq6xrn+rNsxQfykLR4y8bDV5W6hLxNvGqjm7vBGWkuaYsiwpjyx/s9DDfKJQaDGUf4mVTDqECSKUoQ8kCKhMO3JZXzdDPFWzePw91RJFrOiHJIsxTLuVVGSTaE1Ui0BlZ1xERtldf9NNi8qsgKMmNUdUVi+dJk9RLKm6yvN/U2RUJSBinDsIAJMyRYC2GSQmQ2i6ZjWDpu1Y0Bb/0mB3I9wl2lrkmKmznsrdOtCkRCRyMTxGQliAgt1habCdlyw8qSC4DBRMLoCrey/aW0rVbNLS5KkWx4M8tbl2GQF9eZcLuYwQoSYUQU8VJIlGQAspnh9vp42RF3C5Sor/e7sSCBd+gUb65BlqHyIqJFkl47hUxF4piQHGBYGdFSOCrTwags00JICtNQRgggJAhilP3fkcSyTEWwLTRElJEHGaQxKinqBqrXVUV0qJEimekzQIsOHKNaLcvg/P729nZfO+PTzRZ/AADoX7ZoYVJsRSkyfgdllVsL00qGsyIiWljhLMcg0XQQ/hHnWgsVZ0ypnjctp8J2yDqJVJV8Bjk8LML4yN1/gYpdqJMLpKuPiQHeUHwuxX2invLrPGlpd6s5E7F3NEJ+wXaIfwmZPpN0oq6pzuj1WmxC4X7t0SlhUg1ffzcSGAMe3V4frdfhBsago2hthMu66YwR5nDlMejwoqjbmjUedwOqY9CQbVVWVNVt1/E4zFIfS5garzqWIuIhlxPqsoRh1EqTq8uaFIsMdKeJrsxM6GQrnaxYRochCLOMIDE0wwclISiFJ4RbQm2KiJqVSYZds1V1QriqUNuN9SS9vu2/xQVYJAkCYOiAGGHpYIBBtBBEiJYjUigq8FCUw3BCuBe1TLZS1vkTE0JUqSpkMjQ6k+1PcL6OLSRNDBq5kE4uUO6EGRwwwVCIpVkECE8JR2leDkp0SEbsaCGP2Mi60t1wpfcPf1jHczI/2OV5F3R5DpG3OYgAGs4GjxbmLc3Pu5PCioV8mNckQe/wKbzsw0qLRt6NJvKtQY7BK2ZuoefJ+3957GrWk75nJZg29KgvyoPFWS98MP36SQG8e2oJZAEMQMgGWRheAWZdP82HZfn37FgV3tW7MjTv3sI3Dl6C7WDDqeMzQMmQkMdTkJPf5cnZ/NoXZ4837OE/35cuda6c+TXy8Pquzpe3lX/9zbXLp7cWl+d9MuX8htKzq4zPtuf+eOAiveWJoy8+v2tlz77O7R81bD01u+9Y+7npu+uK5EMXDhXN75AfmdJLrevo6ptZ3Ln5+9c3fteHTi/z0pd/qD659plra5fuXbfhwnMPvTXniO+lvbkLChbAht1vX/lzy8I/9sjlf507OOvvmt+Vvqd27a8oaTx8mP3yw8cPzn3v06nTnXeOlzInp+0Hr361+ugJUe6dcSLSvWZ9mXjs5NPCzhfmRJZX1sw6tu5q58YPpp5/8+IBVLaJClzq2tHcu/pn9ZUS44H0mZr297ur1j/78c5v9wR+m9FWdmRbM1+6aWZ/Gf8Bds5nt2wRAAA=",
			"Content-Type": "application/json",
			"X-EBAY-C-ENDUSERCTX": "contextualLocation=country=<2_character_country_code>,zip=<zip_code>"
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
	function initiateCheckOutSession(){
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
			,"lineItemInputs": [{"quantity": 1, "itemId": "<item_id>"}]
		}
		request.post(options, {form:{key:'value'}}, (error, response, body)=>{
			console.log(body);
		});
	}

	return routes;
}