const routes = require("express").Router();
const request = require("request"); 
const parseXmlString = require('xml2js').parseString;
console.log("eBay controller: \x1b[32mloaded!\x1b[0m");

module.exports = function() {
	const objectToExport = {};
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
	var soapOptions = {
		
		headers: {
			"X-EBAY-API-SITEID":0,
			"X-EBAY-API-COMPATIBILITY-LEVEL":967,
			"X-EBAY-API-CALL-NAME":"PlaceOffer"
		},
		method: 'POST'
	}

	objectToExport.findDetails = (eBayId)=>{
		console.log("find eBay details fires")
		const infoObject = {};
		soapOptions.uri = 'https://api.sandbox.ebay.com/ws/api.dll';
		soapOptions.body = `<?xml version="1.0" encoding="utf-8"?>
		<GetItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
		<RequesterCredentials>
		<eBayAuthToken>AgAAAA**AQAAAA**aAAAAA**FGBrWg**nY+sHZ2PrBmdj6wVnY+sEZ2PrA2dj6wFk4GpCJOEogydj6x9nY+seQ**mHQEAA**AAMAAA**cK71cEmLWlqVEVsDKA7r5hwPbjj6l8I8BDLuCuXvBMulKHN3b2pogiRahTHRx1xV3G+LAff66fdx/IZOC8KM8c/sJM+7VhKnAxWuBA1LnEbVm5kxNYcHCykR94QFbnMbGLOW5xjZ6D3bd+0LVjjYfh4uvNF5Lj1b3GeNhyYKnAYAfNVy7Ueb0+PBByizynGLB1CBf1rYU9+gBl4jVXRUGxXgyKfOqekKG5CM+6xTVEZjYQoX5/CB6gYKkcO4jQ/1ArvSVwbYp+ld1I6Qsqv2ZfUvPN8AS0Q51XS6p0OCVQEd+QF/I2PNvghr/HioGDb7Ie/SLINDXVPt7LyM5xHOSS4GHT/5rZfm43WAA1Az3xV/dI+Wyx7LKD6kOhcBRQyRFYd9T2bEvfd9npRdjCCpxT5FlGwZ6qxtS14420jv85MfW18VFOz5R96NGLyIMMO43aXBKi1gDhoskkh9FDpC1GbHAGloacBOXw+8sCtoO3PVloW+IVUBGaKRBqxFOnE3toeZSauSXvJ19i5GtMIR8cEVHIWK9CR4M//cQje9WhFs4Usj4EJD7KFWmfwOht/VQY+OAYOirMRDFZQ2GHFtDicdXPXKX3EURybPWjx+S7PQ6MoHwUZWhpE7/CMGVi8lKiUBTcveKV9DI5bodJt6ZbT0sWgN1ydS+YBz0iqX4W87fX0hufnWNLekG378RsV9GOERoCi2T5vJYo5xt6UB1LsdlHBjXjjIeAa+cPvtr/yH4H14DDfRThrFuVgGNw+D</eBayAuthToken>
		</RequesterCredentials>
		<ErrorLanguage>en_US</ErrorLanguage>
		<WarningLevel>High</WarningLevel>
		<!--Enter an ItemID-->
		<ItemID>`+eBayId+`</ItemID>
		</GetItemRequest>`;
		request(soapOptions, function(err, response) {
			if(err){
				console.log(err);
				return (err);
			}
			parseXmlString(response.body, function (err, result) {
				console.dir(result.PlaceOfferResponse);
				return(result.PlaceOfferResponse.Ack);
			});			
		});
		return infoObject;
	};

	//routes.get("/test/:id/:price", 
	objectToExport.buyItem = (eBayId, price)=>{
		console.log("buy Item function fires");
		console.log("Buy item: "+ eBayId + ", quantity: 1, price:" + price);
		soapOptions.uri = 'https://api.sandbox.ebay.com/ws/api.dll';
		soapOptions.body= '<?xml version="1.0" encoding="utf-8"?> <PlaceOfferRequest xmlns="urn:ebay:apis:eBLBaseComponents"> <!-- This call works only in Sandbox. To use this call in Production, the APPID needs to be whitelisted--> <RequesterCredentials> <eBayAuthToken>AgAAAA**AQAAAA**aAAAAA**YS1pWg**nY+sHZ2PrBmdj6wVnY+sEZ2PrA2dj6wFk4GpCJOEogydj6x9nY+seQ**mHQEAA**AAMAAA**cK71cEmLWlqVEVsDKA7r5hwPbjj6l8I8BDLuCuXvBMulKHN3b2pogiRahTHRx1xV3G+LAff66fdx/IZOC8KM8c/sJM+7VhKnAxWuBA1LnEbVm5kxNYcHCykR94QFbnMbGLOW5xjZ6D3bd+0LVjjYfh4uvNF5Lj1b3GeNhyYKnAYAfNVy7Ueb0+PBByizynGLB1CBf1rYU9+gBl4jVXRUGxXgyKfOqekKG5CM+6xTVEZjYQoX5/CB6gYKkcO4jQ/1ArvSVwbYp+ld1I6Qsqv2ZfUvPN8AS0Q51XS6p0OCVQEd+QF/I2PNvghr/HioGDb7Ie/SLINDXVPt7LyM5xHOSS4GHT/5rZfm43WAA1Az3xV/dI+Wyx7LKD6kOhcBRQyRFYd9T2bEvfd9npRdjCCpxT5FlGwZ6qxtS14420jv85MfW18VFOz5R96NGLyIMMO43aXBKi1gDhoskkh9FDpC1GbHAGloacBOXw+8sCtoO3PVloW+IVUBGaKRBqxFOnE3toeZSauSXvJ19i5GtMIR8cEVHIWK9CR4M//cQje9WhFs4Usj4EJD7KFWmfwOht/VQY+OAYOirMRDFZQ2GHFtDicdXPXKX3EURybPWjx+S7PQ6MoHwUZWhpE7/CMGVi8lKiUBTcveKV9DI5bodJt6ZbT0sWgN1ydS+YBz0iqX4W87fX0hufnWNLekG378RsV9GOERoCi2T5vJYo5xt6UB1LsdlHBjXjjIeAa+cPvtr/yH4H14DDfRThrFuVgGNw+D</eBayAuthToken> </RequesterCredentials> <ErrorLanguage>en_US</ErrorLanguage> <WarningLevel>High</WarningLevel> <!--Enter the IP address--> <EndUserIP>66.26.136.160</EndUserIP> <!--Enter the ItemID that you want to buy--> <ItemID>'+eBayId+'</ItemID> <Offer> <Action>Purchase</Action> <Quantity>1</Quantity> <MaxBid currencyID="USD">'+price+'</MaxBid> </Offer> </PlaceOfferRequest>'  
		request(soapOptions, function(err, response) {
			if(err){
				console.log(err);
				return (err);
			}
			parseXmlString(response.body, function (err, result) {
				console.dir(result.PlaceOfferResponse);
				return(result.PlaceOfferResponse.Ack);
			});			
		});
	};

	return objectToExport;
}