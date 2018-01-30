const request = require("request");
const parseXmlString = require('xml2js').parseString;

const DEBUG = !(process.env.NODE_ENV == "production");

module.exports = function() {
   refreshToken()
   let authKey = null;
   console.log("\x1b[32m"+authKey+"\x1b[0m");
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
         "X-EBAY-API-SITEID": 0,
         "X-EBAY-API-COMPATIBILITY-LEVEL": 967,
         "X-EBAY-API-CALL-NAME": "PlaceOffer"
      }
   };
   let soapOptions = {
      headers: {
         "X-EBAY-API-SITEID": 0,
         "X-EBAY-API-COMPATIBILITY-LEVEL": 967,
         "X-EBAY-API-CALL-NAME": "PlaceOffer"
      },
      method: 'POST'
   }

   objectToExport.findDetails = (eBayId, cb) => {
      console.log("find eBay details fires " + eBayId);
      soapOptions.uri = 'https://api.sandbox.ebay.com/ws/api.dll';
      soapOptions.headers["X-EBAY-API-CALL-NAME"] = "GetItem";
      soapOptions.body = `<?xml version="1.0" encoding="utf-8"?>
      <GetItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RequesterCredentials>
      <eBayAuthToken>"${authKey}</eBayAuthToken>
      </RequesterCredentials>
      <ErrorLanguage>en_US</ErrorLanguage>
      <WarningLevel>High</WarningLevel>
      <!--Enter an ItemID-->
      <ItemID>` + eBayId + `</ItemID>
      </GetItemRequest>`;
      request(soapOptions, function(err, response) {
         if (err) {
            console.log("\x1b[32mDEBUG: \x1b[0mError in request at findDetails:");
            throw (err);
            return (err);
         }
         parseXmlString(response.body, function(err, result) {
            console.log(result.GetItemResponse);
            cb(result.GetItemResponse.Item[0].SellingStatus[0].ConvertedCurrentPrice[0]._);
         });
      });
   };

   objectToExport.findItems = (keyword, category, cb) => {
      DEBUG && console.log("\x1b[32mDEBUG: \x1b[0mfind items by keyword fires");
      const options = {};
      const header = {
         "Authorization": "Bearer "+authKey,
         "Content-Type": "application/json",
         "X-EBAY-C-ENDUSERCTX": "affiliateCampaignId=<ePNCampaignId>,affiliateReferenceId=<referenceId>"
      };
      const url = `https://api.sandbox.ebay.com/buy/browse/v1/item_summary/search?q=${keyword}&category_ids=${category}`;

      request({ "headers": header, "uri": url }, function(err, response) {
         DEBUG && console.log("\x1b[32mDEBUG: \x1b[0mI've just got answer from eBay");
         if (err) {
            throw (err);
            return (err);
         }
         console.log(response.body)
         cb(response);
      });
   };

   //routes.get("/test/:id/:price", 
   objectToExport.buyItem = (eBayId, price, cb) => {
      console.log("\x1b[32mDEBUG: \x1b[0mbuy Item function fires");
      console.log("Buy item: " + eBayId + ", quantity: 1, price:" + price);
      soapOptions.headers["X-EBAY-API-CALL-NAME"] = "PlaceOffer";
      soapOptions.uri = 'https://api.sandbox.ebay.com/ws/api.dll';
      soapOptions.body = '<?xml version="1.0" encoding="utf-8"?> <PlaceOfferRequest xmlns="urn:ebay:apis:eBLBaseComponents"> <!-- This call works only in Sandbox. To use this call in Production, the APPID needs to be whitelisted--> <RequesterCredentials> <eBayAuthToken>'+authKey+'</eBayAuthToken> </RequesterCredentials> <ErrorLanguage>en_US</ErrorLanguage> <WarningLevel>High</WarningLevel> <!--Enter the IP address--> <EndUserIP>66.26.136.160</EndUserIP> <!--Enter the ItemID that you want to buy--> <ItemID>' + eBayId + '</ItemID> <Offer> <Action>Purchase</Action> <Quantity>1</Quantity> <MaxBid currencyID="USD">' + price + '</MaxBid> </Offer> </PlaceOfferRequest>'
      request(soapOptions, function(err, response) {
         DEBUG && console.log("\x1b[32mDEBUG: \x1b[0mI've just got answer from eBay");
         if (err) {
            console.log(err);
            return (err);
         }
         parseXmlString(response.body, function(err, result) {
            console.log("\x1b[32mDEBUG: \x1b[0mxml answer parse:");
            console.log(result);
            cb(result);
         });
      });
   };

   function refreshToken(){

      var settings = {
         "async": true,
         "crossDomain": true,
         "url": "https://api.sandbox.ebay.com/identity/v1/oauth2/token",
         "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic "+process.env.EBAYB64APPTOKEN,
            "Cache-Control": "no-cache",
            "Postman-Token": "2f56ff2c-319b-6eb6-1b89-075bc2588299"
         },
         form: {
            "grant_type": "refresh_token",
            "refresh_token": process.env.EBAYREFRESHTOKEN,
            "scope": "https://api.ebay.com/oauth/api_scope/sell.account https://api.ebay.com/oauth/api_scope/sell.inventory https://api.ebay.com/oauth/api_scope"
         }
      }
      request.post(settings, function(err, httpResponse, body){
         console.log("\x1b[32mKey refresed2!\x1b[0m");
         authKey = JSON.parse(body).access_token;

         console.log("\x1b[32m"+body+"\x1b[0m")
         console.log("\x1b[32m"+authKey+"\x1b[0m")
         
      });
   };
   setInterval(()=>{
      refreshToken();
   }, 7100000);

   return objectToExport;
}

console.log("eBay controller: \x1b[32mloaded!\x1b[0m");