const request = require("request");
const parseXmlString = require('xml2js').parseString;

const DEBUG = !(process.env.NODE_ENV == "production");

module.exports = function() {

   let authKey = process.env.NODE_ENV == "production" ? null : "v^1.1#i^1#f^0#p^1#r^0#I^3#t^H4sIAAAAAAAAAOVXfWwURRS/612LDVZCIgWBkMvaqHzs3sze197KHblSaivQq95RoQTJ3O5su3C3e9mZpb0QQts0aAyJMWowJpBaTSAhaDQa0fj1j8SICRoxQEgUUaxgxG9JhATn9o5yrQSKlEji/XOZmffe/N7v/d7MDuirqV2wrWXbuTr3lKqhPtBX5XbDqaC2pnrhHZ6q2dUuUGHgHupr6PMOeL5fTFAum5cfxiRvGgT7enNZg8jOZIyzLUM2EdGJbKAcJjJV5FRi5QpZFICct0xqKmaW87U2xTgxnAkEIhKKRDQlFMpANmtcipk2Y1wIQIRgSAuHAYiGEFsmxMatBqHIoMwdQIkHkA+ANAzLMCJDUYhIsJPzdWCL6KbBTATAxR20suNrVUC9OlJECLYoC8LFWxPNqWSitWlZW3qxvyJWvExDiiJqk7GjpaaKfR0oa+Orb0McazllKwomhPPHSzuMDSonLoH5F/AdpiOKJGVQVMlEQVBSUXBSqGw2rRyiV8dRnNFVXnNMZWxQnRauxShjI7MBK7Q8amMhWpt8xb+HbJTVNR1bMW5ZY2JNor2di6e6kW00YoMn1FbZBu18qnE1j2AgiCUtIvLhKFRD4UCwvFEpWpnmcTstNQ1VL5JGfG0mbcQMNR7PDajghhkljaSV0GgRUaWddInDULizWNRSFW3abRTrinMMp88ZXrsCo96UWnrGpng0wvgFh6IYh/J5XeXGLzpaLMunl8S4bkrzst/f09Mj9AQE0+ryiwBA/+qVK1JKN86xZmO2xV537PVrO/C6k4qCmSfRZVrIMyy9TKsMgNHFxcWoGBKjZd7HwoqPn/3HREXO/rEdMWkdElQBAmFRCYRECUniZHRIvCxSfxEHzqACn0PWRkzzWaRgXmE6s3PY0lU5ENLEgKRhXg1HNT4Y1TQ+E1LDPNQwBhhnMkpU+j81ykSlnlLMPG43s7pSmBzBT5bYA5bajixaaLQLbJzC2Sz7m6j2r5gqKaZ6M5Ms9vr1J1qMQVgQlNeFosIFxcz5TcSOtuLUege1byJG/oxdELpsTCiDrbLbZcJOOpOIwBpFnbhLqQ1vtCQ6u7BvKdWxdEt562rpphWc5AWySREsTEzbYh8ZQrJ48aTNjdhgbUwtM5vFVge8ISYm8cr5b66bK2alZHVG4/pbLbPrPMevlLt3wH1+AvpG9NbKHIZgJCBGQUC8oboudeqaLtzc8/T602sxCcXqTfhC8o99rsVdzg8OuN8FA+632IsPRAAPF4L5NZ5VXs/tHGFHqkCQoWbMXkFHmkD0LoM9RywsbMSFPNKtqhr32jlnllyoeCgOrQOzRp+KtR44teLdCOZeXqmG02bWQQnAAIBhGIFiJ7j78qoX1nvvbF75wsvH+/edO/jXSHI4/MbM5me0RaBu1MjtrnYxBbuWbJm54YnNwZe8W/2v3HbWnHdiV+8X1qtHlrdt6enY/+H0zhPpdxJff7uJfDd8f3K1Pq1/ChJ+/XxQmRddlXxx96MNjy8/s/3k+oaL7/14/JPtB/ae/eOQi755186ff4skZiTe3vpstvmip7NlX8vOpi/3HTv80alH4rMX/FA/h9Pyy06K6cTwuT35RYufrPV882fv7Kfy/Yc8nyU+pvc02mLX600fJGqpcLZ+x4LDDau2czNC3Nrq/qHYRXhq/0/ewbpdB/oT97ou3Lf5NHQ9+MvugyOS56ts1e9QOjV/2+BI/fvnU0c/PXZi2pHTR9ADuHnda8Nrnp773PQ90uldjQNr9tL+tY+NPH90cFapjH8DZfVCXMIPAAA="
   console.log("\x1b[32m" + authKey + "\x1b[0m");
   process.env.NODE_ENV == "production" ? refreshToken() : console.log("development mode")
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
         "Authorization": "Bearer " + authKey,
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
      soapOptions.body = '<?xml version="1.0" encoding="utf-8"?> <PlaceOfferRequest xmlns="urn:ebay:apis:eBLBaseComponents"> <!-- This call works only in Sandbox. To use this call in Production, the APPID needs to be whitelisted--> <RequesterCredentials> <eBayAuthToken>' + authKey + '</eBayAuthToken> </RequesterCredentials> <ErrorLanguage>en_US</ErrorLanguage> <WarningLevel>High</WarningLevel> <!--Enter the IP address--> <EndUserIP>66.26.136.160</EndUserIP> <!--Enter the ItemID that you want to buy--> <ItemID>' + eBayId + '</ItemID> <Offer> <Action>Purchase</Action> <Quantity>1</Quantity> <MaxBid currencyID="USD">' + price + '</MaxBid> </Offer> </PlaceOfferRequest>'
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

   function refreshToken() {

      var settings = {
         "async": true,
         "crossDomain": true,
         "url": "https://api.sandbox.ebay.com/identity/v1/oauth2/token",
         "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + process.env.EBAYB64APPTOKEN,
            "Cache-Control": "no-cache",
            "Postman-Token": "2f56ff2c-319b-6eb6-1b89-075bc2588299"
         },
         form: {
            "grant_type": "refresh_token",
            "refresh_token": process.env.EBAYREFRESHTOKEN,
            "scope": "https://api.ebay.com/oauth/api_scope/sell.account https://api.ebay.com/oauth/api_scope/sell.inventory https://api.ebay.com/oauth/api_scope"
         }
      }
      request.post(settings, function(err, httpResponse, body) {
         console.log("\x1b[32mKey refresed2!\x1b[0m");
         authKey = JSON.parse(body).access_token;

         console.log("\x1b[32m" + body + "\x1b[0m")
         console.log("\x1b[32m" + authKey + "\x1b[0m")

      });
   };
   setInterval(() => {
      refreshToken();
   }, 7100000);

   return objectToExport;
}

console.log("eBay controller: \x1b[32mloaded!\x1b[0m");
