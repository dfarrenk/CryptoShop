const request = require("request");
const parseXmlString = require('xml2js').parseString;
const DEBUG = !(process.env.NODE_ENV == "production");

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
      <eBayAuthToken>AgAAAA**AQAAAA**aAAAAA**FGBrWg**nY+sHZ2PrBmdj6wVnY+sEZ2PrA2dj6wFk4GpCJOEogydj6x9nY+seQ**mHQEAA**AAMAAA**cK71cEmLWlqVEVsDKA7r5hwPbjj6l8I8BDLuCuXvBMulKHN3b2pogiRahTHRx1xV3G+LAff66fdx/IZOC8KM8c/sJM+7VhKnAxWuBA1LnEbVm5kxNYcHCykR94QFbnMbGLOW5xjZ6D3bd+0LVjjYfh4uvNF5Lj1b3GeNhyYKnAYAfNVy7Ueb0+PBByizynGLB1CBf1rYU9+gBl4jVXRUGxXgyKfOqekKG5CM+6xTVEZjYQoX5/CB6gYKkcO4jQ/1ArvSVwbYp+ld1I6Qsqv2ZfUvPN8AS0Q51XS6p0OCVQEd+QF/I2PNvghr/HioGDb7Ie/SLINDXVPt7LyM5xHOSS4GHT/5rZfm43WAA1Az3xV/dI+Wyx7LKD6kOhcBRQyRFYd9T2bEvfd9npRdjCCpxT5FlGwZ6qxtS14420jv85MfW18VFOz5R96NGLyIMMO43aXBKi1gDhoskkh9FDpC1GbHAGloacBOXw+8sCtoO3PVloW+IVUBGaKRBqxFOnE3toeZSauSXvJ19i5GtMIR8cEVHIWK9CR4M//cQje9WhFs4Usj4EJD7KFWmfwOht/VQY+OAYOirMRDFZQ2GHFtDicdXPXKX3EURybPWjx+S7PQ6MoHwUZWhpE7/CMGVi8lKiUBTcveKV9DI5bodJt6ZbT0sWgN1ydS+YBz0iqX4W87fX0hufnWNLekG378RsV9GOERoCi2T5vJYo5xt6UB1LsdlHBjXjjIeAa+cPvtr/yH4H14DDfRThrFuVgGNw+D</eBayAuthToken>
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
         "Authorization": "Bearer v^1.1#i^1#r^0#p^1#f^0#I^3#t^H4sIAAAAAAAAAOVXa2wUVRTu9gUESmNiBAXjZmiCQGb2zmO3OyO7uG1paCl9sKUCDZI7M3e6Q3dnxpm7tKtGai2PEEhMxGDUxIqCVB4aSIzyCAiJYiIoEQnR2PDD+CAm6A8kREK8M7uUbSVQoUQS98/mnnvuud/5znfunQt6SifMXrdg3eUy37jC/h7QU+jzsRPBhNKSOZOLCh8pKQB5Dr7+noqe4t6iX+Y6MJW0pMXIsUzDQf7uVNJwJM8YodK2IZnQ0R3JgCnkSFiR4rFFDRLHAMmyTWwqZpLy19VEqLAKWCHIapwGOU4LAWI1rsdsNcm8KPMhQeQ1WClCVVPJvOOkUZ3hYGjgCMUBNkwDlubEVo6TBEEKCozAhpZT/jZkO7ppEBcGUFEPruSttfOw3hoqdBxkYxKEitbFauNNsbqa+Y2tcwN5saI5HuIY4rQzfFRtqsjfBpNpdOttHM9biqcVBTkOFYhmdxgeVIpdB3MH8D2qea6S5RHPyyDIkp3QmFBZa9opiG+Nw7XoKq15rhIysI4zt2OUsCGvQgrOjRpJiLoav/vXkoZJXdORHaHmV8WWxZqbqWibjokx00ZX2xkLm/EEHa9aSodYEArzssrTPBRUWVBDuY2y0XI0j9ip2jRU3SXN8TeauAoR1GgkN3weN8SpyWiyYxp2EV3340ErADkOeTG43C1qtoppnDDcuqIUIcLvDW9fgaHVGNu6nMZoKMLICY+iCAUtS1epkZOeFnPy6XYiVAJjSwoEurq6mC6eMe2OAAcAG1i6qCGuJFAKUsTX7fWsv377BbTupaIQbRF/CWcsgqWbaJUAMDqoKCeyosjleB8OKzrS+g9DXs6B4R0xVh0SCgWRXKmIUABsECnBseiQaE6kARcHkmGGTkG7E2ErCRVEK0Rn6RSydVXigxrHhzVEqyFRowVR02g5qIZoVkMIICTLihj+PzXKaKUeV0wLNZtJXcmMieDHTOy8rTZDG2eq0hkyjqNkkvyNVvs3TdVxU72HSbq9fgeJujEcEgRaOuMqnFHMVMCE5GhzTSs91P7ROAXkdIbpSCMHExQquV1GvUgnEmFIo6ijX5Jtw7stiU4u7PtKdSTdbN66mr1pGS95xlmtMDZyzLRNPjKYJvfiaTU7kUHaGNtmMonsNvaumBi7K+c/um5umpWS1AmNK++3zP7lOX6T3It7fVdHo2+I76/M2SBbyYWCYVG4q7pWe3VtzdzT8/QO0ltgOhip9+ALKTD8vRYt8H5sr+8w6PV9Qp58oBLQ7Bwwq7RoSXHRJMohRyrjQEOVzW5Ghxrj6B0GeY7YiOlEGQvqdmGpr33ahXlX816K/SvA1KG34oQidmLewxFMvzFTwpZPKWPDgOVEjhOEoLAczLgxW8w+VPzgxt3v7yg8dHCu+c0Hu+HM0sWJioE+UDbk5POVFBAJFwycev44dannotS/R4T0sje2l72594WumbtgRUf7tXe++OPS+YVvzX8JX1nxI1vbaRbG5fShjr4jNV99Obns+NGK8MK3p9VenNm98+nT3/768wP7Hp/++YXjR+rHb2g4sWdb2YFntCWvH3h1/Lv7d2766Ny1wbXo5RmbTz3R3rK1aNuzi+UnN73S/tt7Vvn2xL7J6uFdRx89c37g3PqtD5/cOjtRH/l07delU1efvUi/GD07ULul+7GTg9M3rOjsm2XJ8nf7pwzCvX9pndPWz5rkW/PctivV0Y0ttUc3/8k2Hqv/8ES5fxX9cYiZt4Z9TV5T8dNnvw9WWeN3XP4hYG2pLj/z1LhJDZtOtxwUj32v92XL+DfSaJtkww8AAA==",
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
         cb(response);
      });
   };

   //routes.get("/test/:id/:price", 
   objectToExport.buyItem = (eBayId, price, cb) => {
      console.log("\x1b[32mDEBUG: \x1b[0mbuy Item function fires");
      console.log("Buy item: " + eBayId + ", quantity: 1, price:" + price);
      soapOptions.headers["X-EBAY-API-CALL-NAME"] = "PlaceOffer";
      soapOptions.uri = 'https://api.sandbox.ebay.com/ws/api.dll';
      soapOptions.body = '<?xml version="1.0" encoding="utf-8"?> <PlaceOfferRequest xmlns="urn:ebay:apis:eBLBaseComponents"> <!-- This call works only in Sandbox. To use this call in Production, the APPID needs to be whitelisted--> <RequesterCredentials> <eBayAuthToken>AgAAAA**AQAAAA**aAAAAA**YS1pWg**nY+sHZ2PrBmdj6wVnY+sEZ2PrA2dj6wFk4GpCJOEogydj6x9nY+seQ**mHQEAA**AAMAAA**cK71cEmLWlqVEVsDKA7r5hwPbjj6l8I8BDLuCuXvBMulKHN3b2pogiRahTHRx1xV3G+LAff66fdx/IZOC8KM8c/sJM+7VhKnAxWuBA1LnEbVm5kxNYcHCykR94QFbnMbGLOW5xjZ6D3bd+0LVjjYfh4uvNF5Lj1b3GeNhyYKnAYAfNVy7Ueb0+PBByizynGLB1CBf1rYU9+gBl4jVXRUGxXgyKfOqekKG5CM+6xTVEZjYQoX5/CB6gYKkcO4jQ/1ArvSVwbYp+ld1I6Qsqv2ZfUvPN8AS0Q51XS6p0OCVQEd+QF/I2PNvghr/HioGDb7Ie/SLINDXVPt7LyM5xHOSS4GHT/5rZfm43WAA1Az3xV/dI+Wyx7LKD6kOhcBRQyRFYd9T2bEvfd9npRdjCCpxT5FlGwZ6qxtS14420jv85MfW18VFOz5R96NGLyIMMO43aXBKi1gDhoskkh9FDpC1GbHAGloacBOXw+8sCtoO3PVloW+IVUBGaKRBqxFOnE3toeZSauSXvJ19i5GtMIR8cEVHIWK9CR4M//cQje9WhFs4Usj4EJD7KFWmfwOht/VQY+OAYOirMRDFZQ2GHFtDicdXPXKX3EURybPWjx+S7PQ6MoHwUZWhpE7/CMGVi8lKiUBTcveKV9DI5bodJt6ZbT0sWgN1ydS+YBz0iqX4W87fX0hufnWNLekG378RsV9GOERoCi2T5vJYo5xt6UB1LsdlHBjXjjIeAa+cPvtr/yH4H14DDfRThrFuVgGNw+D</eBayAuthToken> </RequesterCredentials> <ErrorLanguage>en_US</ErrorLanguage> <WarningLevel>High</WarningLevel> <!--Enter the IP address--> <EndUserIP>66.26.136.160</EndUserIP> <!--Enter the ItemID that you want to buy--> <ItemID>' + eBayId + '</ItemID> <Offer> <Action>Purchase</Action> <Quantity>1</Quantity> <MaxBid currencyID="USD">' + price + '</MaxBid> </Offer> </PlaceOfferRequest>'
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

   return objectToExport;
}

console.log("eBay controller: \x1b[32mloaded!\x1b[0m");