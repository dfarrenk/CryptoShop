const DEBUG = !(process.env.NODE_ENV == "production");

const request = require("request");
const parseXmlString = require('xml2js').parseString;

module.exports = function() {
    let authKey = process.env.NODE_ENV == "production" ? null : "v^1.1#i^1#f^0#p^1#r^0#I^3#t^H4sIAAAAAAAAAOVXbWwURRjutdcSUgqIiha/zhVQCrs3u3e3d7vpnblrQcpXK1cawEizH7Ptwt3uuTNreyGaWpUI5cMfJP6CNIAKgRjghwYNCQYiYgBNQNEQ5SMQCCEmRhARos7uHeVaCZylRBL3z2Zm3nnneZ953nlnQFfF8Jpl05ddqfIMK+3tAl2lHg9bCYZXlE8eWVY6rrwEFBh4ervGd3m7y87XIimdyohzIcqYBoK+znTKQKLbGaVsyxBNCelINKQ0RCJWxGR89iyRY4CYsUxsKmaK8jXUR6mIHBBCaiAc5oMBnuch6TVu+Gw2o5TGg0gkyEKOC0WgIAMyjpANGwyEJQNHKQ6wERpwNGCb2aAY4kXAMhHALaR8LdBCumkQEwZQMReu6M61CrDeHqqEELQwcULFGuLTko3xhvqpc5pr/QW+YnkekljCNurfqjNV6GuRUja8/TLItRaTtqJAhCh/LLdCf6di/AaYQcB3qRYkEOAFIawGuVAwzIeGhMppppWW8O1xOD26SmuuqQgNrOPsnRglbMiLoYLzrTnERUO9z/m9aEspXdOhFaWmJuIL4k1NVCzZLtlGAho0wrZKFmiik4n5tMQGgjCihTmaF1g1xAeC+YVy3vI0D1ipzjRU3SEN+eaYOAEJajiQm2ABN8So0Wi04hp2EBXa8XkOw2FhobOpuV20cbvh7CtME5w+t3nnHeibjbGlyzaGfR4GDrgURSkpk9FVauCgq8W8fDpRlGrHOCP6/R0dHUxHgDGtNj8HAOufP3tWUmmHaYkitk6u5+z1O0+gdTcUhaQxsRdxNkOwdBKtEgBGGxXjBC7ECXne+8OKDez9R0dBzP7+GTFUGaLJvAIlTiJHDi8LvDwUGRLLi9Tv4ICylKXTkrUE4kxKUiCtEJ3ZaWjpqhgIaVwgokFa5QWNDgqaRsshladZDUIAoSwrQuT/lCjFSj2pmBnYZKZ0JTskgh8ysQcstUmycDZhZ0k7CVMp8itW+7cMFTmh3sMgnVwfRKCOD0ScSBmdcRTOKGbab0rkaHO6Wl3UvmKM/LKdZdpsiDBBoZLqUvQknUiEIYmiFj8ll4YkgOKnkKuLaivYXeiuNlInZf6+0iqJOBe6rubqM+PGz6BXFcaCyLQtcjVhGp1y1WwugQZJfmyZqRS0Wti7YmLoCtV/VKRuGZWS0gmNrfdbZIWnv7e7lCuiAgxS3xK+vyJnQ2w4KPACf3dqrXP3tTl7T0/hQYQ33US4+CPpX9yr/P1febES92O7PbtBt2cXeSiCMKDZyWBSRdk8b9kICpGDmEGSocpmJ6NLGoP0NoM8YizILIHZjKRbpRWelx678Pz1gvdl78vg0b4X5vAytrLguQkevzlSzo56pIoltwnAssEQD9iF4Jmbo152rPeh1VNeWbz8z0MLTrx++uC+H8durOL2bANVfUYeT3mJt9tT8lSTza5qq92w+dmJF97+aOfKls9n7j16buxb77Ze9TYekx8euTORzv725KoDRzYxiyu+PM6vW/XG1YtgzfEVM174ZdTayg31733fumXY6pHjf61stmqO/b5126Kaa6N3xXf4rp0cc2ZRbfXXne98sbWW1Toy19cuPRMc8fP+TVtG7J1YJz7w8ek3Pzl7cfQEbmNP5LlTnfprn869ykzlPzu19KulkT2Xq8HhnmzN/gU97U9X735wX+9R9ont6vpzy/Yt2vzhmuuXN4/yvn/2u4nXLnkPnCntqM+u3X7pmyuJ6nV/TVBOrNR+mrLenNd6iD08buX5xLpLB09Sx8Z9cOTbMDdp6/IdM/Qf/sAz62Znd43JbePfaBZvufkPAAA="
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
        soapOptions.headers["X-EBAY-API-IAF-TOKEN"] = authKey;

        soapOptions.body = `<?xml version="1.0" encoding="utf-8"?>
      <GetItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
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
            authKey = JSON.parse(body).access_token;
            console.log("\x1b[32mKey refresed2! " + authKey.substring(0, 20) + "\x1b[0m");
        });
    };
    setInterval(() => {
        refreshToken();
    }, 7100000);

    return objectToExport;
}

console.log("eBay controller: \x1b[32mloaded!\x1b[0m");