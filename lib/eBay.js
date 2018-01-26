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
				console.log("Error in request at findDetails:");
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
		console.log("find items by keyword fires");
		const options = {};
		const header = {
			"Authorization":"Bearer v^1.1#i^1#r^0#p^3#f^0#I^3#t^H4sIAAAAAAAAAOVXW2wUVRjutttiqVUSBEs1ZBmgCTazO7OzOzs76S7Z3kKVXuiWCjWmnplzph2YnVnnzLRdeCmNVsRKDFQNykMDRjEqMRoTfQASgzGa6AsgRmhEVBRpMNYLRAE9s72wrQq9kNjEeZmcc/7b9//f/88cpjsv/77eNb2XCl3zsge6me5sl4stYPLzckvvyMkuzs1iMgRcA90rut09Od+XYZDQkmIjwklDx8jTldB0LKY3I5Rt6qIBsIpFHSQQFi1ZjMdq14p+LyMmTcMyZEOjPDWVEUoBPMspgqzwfqiEgoDs6mM2m4wIBcMK9EOORUEYCAWRn5xjbKMaHVtAtyKUn2EFmmFpP9/ECmJQENmwN8QJLZSnGZlYNXQi4mWoaDpcMa1rZsR641ABxsi0iBEqWhOrjtfHaiqr6prKfBm2oqN5iFvAsvHEVYUBkacZaDa6sRuclhbjtiwjjClfdMTDRKNibCyYGYSfTnWQ43g2xAVCQAoinoW3JJXVhpkA1o3jcHZUSCtpURHplmqlbpZRkg1pE5Kt0VUdMVFT6XFe62ygqYqKzAhVVR7buD5e1Uh54g0NptGhQgQdpCzHCQzHcyRYC2GSQmS2ymYqaRm43UiOehsxOZrrSe4qDB2qTuawp86wyhEJHU1OUCAjQUSoXq83Y4rlhJUh52fGE8m2OJUdKaVttetOcVGCZMOTXt68DGO8uM6EW8UMBDg+LAuKFA4FOWkiMZxenyE5ok59Yg0NPicUJIEUnQDmZmQlNSAjWibZtRPIVKHIBRU/JyiIhnxYoQNhRaGlIORpVkGIQUiS5LDwv+OIZZmqZFtonCeTD9JII1RcNpKowdBUOUVNFkkPn1FWdOEI1W5ZSdHn6+zs9HZyXsNs8/kZhvVtqF0bl9tRgkzfMVn15sK0miaIjIgWVkUrlSTRdBH6Eed6GxXlTNgATCtVbqfIOo40jbzGKDwhwujk3X+Bih2ocwuko4+JAZBUvQ7FvbKR8BmAdLSz1ZqO2DMVIZ9kp4h/iEyviQA0dC01db02m1B4RHtqSphUwzvSjQTGmEen16fodaKBaeioegfhsmGmpglzovI0dIAsG7ZuzcTdqOo0NBRbU1RNc9p1Jg4z1KcTpg60lKXKeNzlrLoslkzWwLnVZc2qRQZ6qpmuSE/oeDsdL99A8yzDC+R7xdEcCEApAPlZ4YaoQ5VRqzrHsOu2ps0KVyXq+Id6kl5/6T/FxQgIShLD0X45JNABP4doKYAQrYRgMCwBllwJ2Fnhrm2ba6Ws88VmhahCU8lkaErNtY/gGgNbCM4OGvkfnVugnAkzNmACwaBAC4ghPCUcpYESgHRQQcJUIU/ayPil+9sfvW/ivTqalX7YHtchpsf1HrmaMyGGZkuZVXk56905t1NYtZAXAx1KRpdXBYoXq206uTaayLsZpZJANbPzXA/d88PqKxk3+oGHmaLxO31+DluQccFn7r1+ksveeXchKzCsn2eFoMCGW5jl10/d7GL3XdsP2vOKvgvsyuN/XPzNV48uLFz60SmmcFzI5crNcve4spIn4PJ5zJfKxQdfb+xbtuvl0gPvX1gE3s3b0vnUcKlvy0Vq5xO7+YHHSspWNBwbfL61/+qF/YNH93dUbPf/vPdsfF9zb8nV17YvemH5wqLa8KfFH/Qdfnr+xhNwSd+RZ5WSFz/bsfSR42fP/XSs/Q9wbbD62OONZV9fWw3gutOnXnnOvWT4Qv+2j6sL5KObVu7IP3ikbg/c9Ebv5SGv69Dvp8Vvi+8fWgn/nL+4HrtXnbk8PNhbf3LB+ePbEgt+LXr1/Naz8aP9xxftPCAf2bVv9xefF2wduLLMOHPprTMf/hK7beM716ihLP63w33zT52reaBOfrvqmb1Nb3a0DDVvHirWhksW9n9y8vyefb1PVo6U8S++2EP+axEAAA==",
			"Content-Type":"application/json",
			"X-EBAY-C-ENDUSERCTX":"affiliateCampaignId=<ePNCampaignId>,affiliateReferenceId=<referenceId>"
		};
		const url = `https://api.sandbox.ebay.com/buy/browse/v1/item_summary/search?q=${keyword}&limit=10`;
		
		request({"headers": header, "uri":url}, function(err, response) {
			if(err){
				throw(err);
				return (err);
			}
			cb(response);	
		});
	};

	//routes.get("/test/:id/:price", 
	objectToExport.buyItem = (eBayId, price, cb)=>{
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
				cb(result.PlaceOfferResponse.Ack);
			});			
		});
	};

	return objectToExport;
}