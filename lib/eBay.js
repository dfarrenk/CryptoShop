const request = require("request");
const parseXmlString = require('xml2js').parseString;
const DEBUG = process.env.NODE_ENV == "development";

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
         "Authorization": "Bearer v^1.1#i^1#f^0#p^1#r^0#I^3#t^H4sIAAAAAAAAAOVXbWwURRju9UsrFCEqXyJcVoIBsnuzu9e7vaV3em0pPYW2cNcDUaj7Mdsu3O2eO7O0R1BLRQImRhO+JMak8QNIJSEiMREhiv4RDf6QP4aIUcRIDBY0BqLW6uzeUa6VQIUSSbw/l3nnnXee93mfd2YHdJVXzNnYsPFipee24p4u0FXs8bBjQEV52dxxJcVTy4pAgYOnp2tmV2l3yZlqJKVTGXEJRBnTQNDbmU4ZSHSNYcq2DNGUkI5EQ0pDJGJFjEcXLRQ5BogZy8SmYqYob6wuTIVk2R8EgqTJwZDAAT+xGpdiJswwVSVxigAlXgoCWQgAlcwjZMOYgbBk4DDFAVagAUtzQoLjRb8gcgID/MJyypuEFtJNg7gwgIq4cEV3rVWA9epQJYSghUkQKhKL1seborG6+Y2Jal9BrEiehziWsI2GjmpNFXqTUsqGV98Gud5i3FYUiBDli+R2GBpUjF4Ccx3wXap5vkqGahDwIdYvAP/oUFlvWmkJXx2HY9FVWnNdRWhgHWevxShhQ14FFZwfNZIQsTqv87fYllK6pkMrTM2viT4abW6mIkkdE2M2Sdda2Qw24+10vGYZHWBBQOBllad5ya/KfjWQ3ygXLU/zsJ1qTUPVHdKQt9HENZCghsO54Qu4IU5NRpMV1bCDaNAvlADsIIdguVPUXBVt3G44dYVpQoTXHV67AoOrMbZ02cZwMMLwCZeiMCVlMrpKDZ90tZiXTycKU+0YZ0Sfr6Ojg+ngGdNq83EAsL5lixbGlXaYliji6/R6zl+/9gJad1NRIFmJdBFnMwRLJ9EqAWC0UREuxIZCXJ73obAiw63/MBTk7BvaEaPVIZqmKUogGKhSg4qssspodEgkL1KfgwPKUpZOS9ZqiDMpSYG0QnRmp6GlqyJfpXG8oEFaDYQ02h/SNFquUgM0q0EIIJRlJST8nxplpFKPK2YGNpspXcmOiuBHTey8pTZLFs7W2FkyjsNUivyNVPtXTBU5qd7EJJ1ev45EnRiIBJEyOuMonFHMtM+UyNHmmFpd1N6ROPlkO8u02RBhgkIlt8uIF+lEIgxpFHXkS3JteKMl0cmFfUupjqSby1tXczct4ybPoDUKY0Fk2hb5yGCanIsnYa6GBmljbJmpFLSS7A0xMXpXzn903VwxKyWlExpbb7XM/uU5foXcS7s9/SPRt4RvrczZKjbICjwPhBuqa61b10T2pp6n15Feg4kwVG/CF5Jv6HstUuT+2G7PYdDteY88+UAQ0OxcMLu8pKW0ZCyFyJHKIMlQZbOT0SWNQXqbQZ4jFmRWw2xG0q3ics9j9/74YH/BS7FnBZg8+FasKGHHFDwcwbTLM2XsnZMqWQGwnMDxfoETloP7L8+WshNL754yYfv8b5SHjFkXVvx5fkfXuppPt7KgctDJ4ykrIhIu2r3deOC7/vIP7znw6uZt2ZKVO1s3nHjxWM/BFSf22p89cmH2w/cd/nhV/Yl31CX7Ylzqq/0Nr3/b+Mfa/bv+enbBYv780t87Npd9ca5+zMAvu6I/Vy883rtj5cEnt5xaGq08eGjdaxVfzlv/9EvHntpgD+zpOqXM2LOuPNj7csP3u8+O23N6TTtIPnExyd4VH7u3bb311gdHhLWTf9t6zP6o6IfniuPj+3z9b049u2DeTmva9C027p7YN+XArEW943tfaWl5o++n5nNvH2G+TohH57ww48y7wdtPLl21rfVXdauHPvTMJP/6U/vOT5+Ii1umWLuXHJ054fgdJy15U9/Apvcf93w+UN0yaWPN6djKT54vy5Xxb7emI2HDDwAA",
         "Content-Type": "application/json",
         "X-EBAY-C-ENDUSERCTX": "affiliateCampaignId=<ePNCampaignId>,affiliateReferenceId=<referenceId>"
      };
      const url = `https://api.sandbox.ebay.com/buy/browse/v1/item_summary/search?q=${keyword}&limit=10&category_ids=${category}`;

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
            DEBUG && console.log("\x1b[32mDEBUG: \x1b[0mxml answer parse:");
            console.log(result);
            cb(result);
         });
      });
   };

   return objectToExport;
}

console.log("eBay controller: \x1b[32mloaded!\x1b[0m");