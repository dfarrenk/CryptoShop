const routes = require("express").Router();
const request = require("request"); 
const parseXmlString = require('xml2js').parseString;
console.log("eBay controller: \x1b[32mloaded!\x1b[0m");
const DEBUG = true;

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
	let soapOptions = {		
		headers: {
			"X-EBAY-API-SITEID":0,
			"X-EBAY-API-COMPATIBILITY-LEVEL":967,
			"X-EBAY-API-CALL-NAME":"PlaceOffer"
		},
		method: 'POST'
	}

	objectToExport.findDetails = (eBayId, cb)=>{
		console.log("find eBay details fires " + eBayId);
		soapOptions.uri = 'https://api.sandbox.ebay.com/ws/api.dll';
		soapOptions.headers["X-EBAY-API-CALL-NAME"] = "GetItem";
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
				console.log("\x1b[32mDEBUG: \x1b[0mError in request at findDetails:");
				throw(err);
				return (err);
			}
			parseXmlString(response.body, function (err, result) {
				console.log(result.GetItemResponse);
				cb(result.GetItemResponse.Item[0].SellingStatus[0].ConvertedCurrentPrice[0]._);
			});			
		});
	};

	objectToExport.findItems = (keyword, cb)=>{
		DEBUG && console.log("\x1b[32mDEBUG: \x1b[0mfind items by keyword fires");
		const options = {};
		const header = {
			"Authorization":"Bearer v^1.1#i^1#f^0#I^3#r^0#p^3#t^H4sIAAAAAAAAAOVXa2wUVRTu9mV4aRARQ7FuRjBQmN07M/uYHdgl2xbCRmiX7lKgiGUed9opszPr3DttJyFSKyFAiPGFoARTH0BilIgaEBJiotEIBkJQNKKoP5QQgkZFyg+N8c72wbZE6IPEJu6fydx7Ht93znfuzgUdpeMqNi/ZfG2S547Crg7QUejxMBPAuNKSuXcWFU4vKQB5Bp6ujpkdxZ1FFxcgMaNnhTqIsqaBoLc9oxtIyC1GKdsyBFNEGhIMMQORgGUhFV+2VGB9QMhaJjZlU6e8ieooFYQhiQ+rfFhkgowKw2TV6IuZNqMUFCNhRgIKFwHhiMQDso+QDRMGwqKBoxQLGJ4GDM3yaQAEJiAEGF+ABQ2Utx5aSDMNYuIDVCwHV8j5WnlYbw5VRAhamAShYon44lRtPFG9qCa9wJ8XK9ZbhxQWsY0GvlWZCvTWi7oNb54G5ayFlC3LECHKH+vJMDCoEO8DMwL4uVKLkI8oPB9SGU4JsQp7W0q52LQyIr45DndFU2g1ZypAA2vYuVVFSTWkFijj3rcaEiJR7XUfy21R11QNWlFqUWV89YrUojrKm0omLbNVU6DiMmU4jgdciCNgMUSkhNBqlC0ni03UbGZ7s/WE7K31oHRVpqFobuWQt8bElZBAh4MLBPIKRIxqjVorrmIXVr4d21dIhm1wO9vTShs3G25zYYZUw5t7vXUb+nRxXQm3SxmRkMoxaoDMH6uGwoqYrwx31keqjpjboHgy6XexQEl06IxorYc4q4sypGVSXjsDLU0RuKDKcrwKaSUUUelARFVpKaiEaIIIAgglSY7w/zuRYGxpko1hv1AGb+SYRqmUbGZh0tQ12aEGm+ROn15ZtKMo1YxxVvD729rafG2cz7Sa/CwAjH/VsqUpuRlmSOf7bLVbG9NaTrMyJF5IE7CTJWjaif5IcqOJinGWkhQt7FTaDnlPQV0njz4ND0AYG7z6L1SRS3VskXT9EQkgZjWfK3GfbGb8pkhG2l1qzCH2DsXIL9kOya9Ay2dBUTEN3Rm6X5NNJNzjPTQnRLrh65lGQqM3ozvrQ806MMAwfDSjlWjZtJxh0hzoPAwfUZZN28AjSdfrOgwP1dZVTdfdcR1Jwjz34cA0RN3Bmoz6U45qyuLZbEIZW1NWr2FyoDv1dFXuhE4106nKVXSIASGekxSO5sSAIgWU0Kh4K7BVk2GjNsa4G7auj4pXNWy9sZ9k1vf+t7wADxVJAhzNymGeDrAcpKUAhLQaVoIRSWRkNcSMiveyprHWyhp/fFSMqnSNnAxpZ6z9CS4xEYbK6KiRD9KxRco9YfoOmEAwyNM8BESnRKO0qAYUOqhCfqiUBy3kfdLd8EnvH3ixjhXkfkyn5xjo9Bwhd3MQBjQzF8wpLVpRXDSRQhqGPiQaimS2+zRR9SGtySD3Rgv61kMnK2pWYalnTdmlhX/lXem71oL7+i/144qYCXk3fDDj+k4Jc9e0SQwPGJYntQsEmAbw4PXdYube4ntWbfQlf2z/s/TR2syhmJ6eFmls/BBM6jfyeEoKijs9Bbt2nPqIPtRyuPv0rPTy5t8qDp7fVHLg3PiHK1sO3l924dSh3d+cf+ls4x9LX193dvHsurffv3TmyXTm6BnlsvLKkhlvvPtOw8XvEnWzxsOTK5VXd17+Glz7ZVr5Jwu/L0zvKj136RF/mb3P2Tr/gz1Ttjx77MR7Dzxd8eX0nXbisXlfTD1efkEr2w4Onq7Z9tBTkyf+vXvn4Ss/vbnnGW5N+drZZ1IXPGtLy1v2n7Ufn5/eUli77ugLwa6pm2d+u+LF+BNXN3g12r9tZffkKZmfhR0f742y1NHklrurJjz38tZ5v66esnHrZ+2Zt+ZcyW7o3vHayc/3H9jLlW96/tOK9u5t4ePHUttnM0d++P2rfVfPn6jraeM/quRwJWwRAAA=",
			"Content-Type":"application/json",
			"X-EBAY-C-ENDUSERCTX":"affiliateCampaignId=<ePNCampaignId>,affiliateReferenceId=<referenceId>"
		};
		const url = `https://api.sandbox.ebay.com/buy/browse/v1/item_summary/search?q=${keyword}&limit=10`;
		
		request({"headers": header, "uri":url}, function(err, response) {
			DEBUG && console.log("\x1b[32mDEBUG: \x1b[0mI've just got answer from eBay");
			if(err){
				throw(err);
				return (err);
			}
			cb(response);	
		});
	};

	//routes.get("/test/:id/:price", 
	objectToExport.buyItem = (eBayId, price, cb)=>{
		console.log("\x1b[32mDEBUG: \x1b[0mbuy Item function fires");
		console.log("Buy item: "+ eBayId + ", quantity: 1, price:" + price);
		soapOptions.headers["X-EBAY-API-CALL-NAME"] = "PlaceOffer";
		soapOptions.uri = 'https://api.sandbox.ebay.com/ws/api.dll';
		soapOptions.body= '<?xml version="1.0" encoding="utf-8"?> <PlaceOfferRequest xmlns="urn:ebay:apis:eBLBaseComponents"> <!-- This call works only in Sandbox. To use this call in Production, the APPID needs to be whitelisted--> <RequesterCredentials> <eBayAuthToken>AgAAAA**AQAAAA**aAAAAA**YS1pWg**nY+sHZ2PrBmdj6wVnY+sEZ2PrA2dj6wFk4GpCJOEogydj6x9nY+seQ**mHQEAA**AAMAAA**cK71cEmLWlqVEVsDKA7r5hwPbjj6l8I8BDLuCuXvBMulKHN3b2pogiRahTHRx1xV3G+LAff66fdx/IZOC8KM8c/sJM+7VhKnAxWuBA1LnEbVm5kxNYcHCykR94QFbnMbGLOW5xjZ6D3bd+0LVjjYfh4uvNF5Lj1b3GeNhyYKnAYAfNVy7Ueb0+PBByizynGLB1CBf1rYU9+gBl4jVXRUGxXgyKfOqekKG5CM+6xTVEZjYQoX5/CB6gYKkcO4jQ/1ArvSVwbYp+ld1I6Qsqv2ZfUvPN8AS0Q51XS6p0OCVQEd+QF/I2PNvghr/HioGDb7Ie/SLINDXVPt7LyM5xHOSS4GHT/5rZfm43WAA1Az3xV/dI+Wyx7LKD6kOhcBRQyRFYd9T2bEvfd9npRdjCCpxT5FlGwZ6qxtS14420jv85MfW18VFOz5R96NGLyIMMO43aXBKi1gDhoskkh9FDpC1GbHAGloacBOXw+8sCtoO3PVloW+IVUBGaKRBqxFOnE3toeZSauSXvJ19i5GtMIR8cEVHIWK9CR4M//cQje9WhFs4Usj4EJD7KFWmfwOht/VQY+OAYOirMRDFZQ2GHFtDicdXPXKX3EURybPWjx+S7PQ6MoHwUZWhpE7/CMGVi8lKiUBTcveKV9DI5bodJt6ZbT0sWgN1ydS+YBz0iqX4W87fX0hufnWNLekG378RsV9GOERoCi2T5vJYo5xt6UB1LsdlHBjXjjIeAa+cPvtr/yH4H14DDfRThrFuVgGNw+D</eBayAuthToken> </RequesterCredentials> <ErrorLanguage>en_US</ErrorLanguage> <WarningLevel>High</WarningLevel> <!--Enter the IP address--> <EndUserIP>66.26.136.160</EndUserIP> <!--Enter the ItemID that you want to buy--> <ItemID>'+eBayId+'</ItemID> <Offer> <Action>Purchase</Action> <Quantity>1</Quantity> <MaxBid currencyID="USD">'+price+'</MaxBid> </Offer> </PlaceOfferRequest>'  
		request(soapOptions, function(err, response) {
			DEBUG && console.log("\x1b[32mDEBUG: \x1b[0mI've just got answer from eBay");
			if(err){
				console.log(err);
				return (err);
			}
			parseXmlString(response.body, function (err, result) {
				DEBUG && console.log("\x1b[32mDEBUG: \x1b[0mxml answer parse:");
				console.log(result);
				cb(result);
			});			
		});
	};

	return objectToExport;
}