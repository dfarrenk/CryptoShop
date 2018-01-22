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
			Authorization:"Bearer v^1.1#i^1#r^0#p^3#f^0#I^3#t^H4sIAAAAAAAAAOVXe2wURRjvtb0SAkVNDG/NuRiikL2b3b29u91wZ64PbIW2J9c2PDQwuzvbruztXnZ2266KOauiWENJrJoYom2MxsSgwYQgoiEoRANRFP1HCCSCD4IISCQgIcbZ64NridAHiU28fzbzzff6fd/vm5sBubKpizbWbLxU7ptS3JsDuWKfj5kGppb5F88oKZ7rLwIFCr7e3L250s6SU0swzOhZcQXCWdPAKNCR0Q0s5oVxyrEM0YRYw6IBMwiLtiymk3XLRTYIxKxl2qZs6lSgtipOKVBCERSBYSDwapQHRGoM+mw04xSLGBZIYaRGo2EWsN4+xg6qNbANDZvsAyZGA4Zm2UYQFQEv8lxQ4LnVVKAZWVgzDaISBFQin66Yt7UKcr1xqhBjZNnECZWoTS5NNyRrq6rrG5eECnwlBuqQtqHt4OGrSlNBgWaoO+jGYXBeW0w7sowwpkKJ/gjDnYrJwWTGkX6+1LzAASQIUgwKAh9G7C0p5VLTykD7xnl4Ek2h1byqiAxbs92bVZRUQ3oMyfbAqp64qK0KeJ+HHahrqoasOFVdkVzVlK5eQQXSqZRltmkKUjykDMfFABfhSLI2wqSEyForW27WNnGrmR2I1u9yoNYjwlWahqJ5lcOBetOuQCR1NLxAEZEvKBBRajAarKRqe2kV6gmDhQyHV3ud7W+lY7caXnNRhlQjkF/evA2DvLjGhFvFDARjghSNClwUIBBRIoXM8GZ9vOxIeA1KplIhLxckQZfOQGs9srM6lBEtk/I6GWRpisjxKsvFVEQrEUGlw4Kq0hKvRGhGRQggJEmyEPvfkcS2LU1ybDRElJEbeaRxKi2bWZQydU12qZEq+dNngBYdOE612nZWDIXa29uD7VzQtFpCLABMaGXd8rTcijKQGtLVbq5Ma3nOyohYYU203SzJpoPwjwQ3WqgEZykpaNluheOSdRrpOvkMcnhYhomR0n+Bij2okwukZ4+JA5jVgh7Fg7KZCZmQjLQnWpvPODAapZDkuCS+gqyghaBiGro7ersWh1C433p0Rph0I9g/jQTGQERv1kcbdbiDMdhoRhvhsmm5Y4Q53HgMNlCWTcewxxNuwHQMFqqjq5que+M6noAF5mNJ04C6a2syHgo5oSlLZrO1yuSasmbNJge620xX5k/odCudrlhJRxgQiXGSwtEcDCtSWIlMCLeC2jQZrdUmGXbD0fUJ4apCbdf3k8z62/8tLhBDiiQBjmblaIwOsxyiyUUf0WpU4QUJMrIaYSaEu65lsrWyPpScEKJKXSMnQ6M72f4Ea0xsI2Vi0MiFdHKB8k6YwQMmzPMxOoYA4SnhKA3VsELzKoqNFvIIQcGV7rorfWj4wzpRlP8xnb5PQadvF3mbgyigmcXg/rKSptKS6RTWbBTE0FAksyOoQTWItRaDvBstFFyP3CzUrOIy35p5px+4WvCk730UzB561E8tYaYVvPDB/Gs7fua2WeVMDDAsS8Ly5B4LFlzbLWVmlt55/A3+jh/ngi2f7fh6J/PQD92nNm45AMqHlHw+f1Fpp6/oroorP3/+zZqll5XX+ON986W+TRtSSkVPZm+7PX3fjtm7F74K3eZFlx5Hh7v+nPZ73ekmfOSZhb6XS+Rvr3z3YNcscOLJOfufvnA0xR8++O7mvw6s+2Xunv33PPteA3iqayt/Yt4edPLqot3bG3I7j5pTjpzdsTUllIBA0+a+c68H/LmqUrnHP/Pkxb9X/bZpceTMlnV/1Bw6ffvFpr3Pw86muovnF1x4Mw6SNWc6L//ae/J9cZ+/nO2aeaxFevGVLlX/6J14+olcatuyltSJS9u7/RL4/rndL731066u8CP3uR/3nPN9YnHbPji7dcqXx+YsmNG97ODdX3y1ZuGHM87neuYHD82e80L1/r4N/W38Bwxr/q1sEQAA",
			"Accept":"application/json",
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
		request.post(options, requestBody, (error, response, body)=>{
			if(error){
				throw error;
			}
			console.log(body);
		});
	}
	routes.get("/test/:id", (req, res)=>{
		console.log("test route runs");
		initiateCheckOutSession(req.params.id);
		res.status(200);
	});

	return routes;
}