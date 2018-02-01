const DEBUG = (process.env.NODE_ENV == "production");
const routes = require("express").Router();
const eBay = require("../lib/eBay.js")();
const coinbase = require("../lib/coinbase.js")();
const CRUD = require("../lib/CRUD.js");
const Auth = require("../lib/authcallback.js")();
const ServErr = require("../util/servError.js");
const mail = require("../lib/sendgrid.js");
const signToken = require("../lib/signToken.js");
const { "token-timeout": expiredIn } = require("../config/config.json");
//https server for web-token
const {https_config} = require("../config/config.js");
const https = require("https");
//Web-socket implementation, I have to create a https-server one more time, because IO require HTTP server, not a route, I want to read docs if it is able to read router somehow
const server_s = https.createServer(https_config, routes);
const io = require('socket.io')(server_s);
let currentSocket=null;
let currentClientId = null;
io.on('connection', function (socket) {
   DEBUG && console.log("Order process started:");
   DEBUG && console.log(socket.client.conn.id)
   socket.emit('news', { hello: 'world' });
   socket.on('my other event', function (data) {
      console.log(data);
   });
   socket.on('disconnect', function () {
      console.log('user disconnected');
   });
   currentSocket = socket;
   currentClientId = socket.client.conn.id;
});
server_s.listen(3000, function(){
   console.log('\x1b[32mWeb-socket listening on *:3000\x1b[0m');
});


require("../util/errorHandler")();

//1)DONE: user go to search page
//2)DONE: select item
//3)DONE: click Payment
//4)DONE: click Submit (list the order)
//5)DONE: the script will send object to /buyItem route
//6)DONE: buyItem route will start checking the current transaction on our wallet 
//7)DONE: once we will get transaction - server will break checking function,
//8)DONE: server will purchase the item what user wants, and write it in the database
//9)DONE: eBay will send the item to customer 下 卞 巃 籠 嚨 櫳 瓏

module.exports = function() {
   routes.get("/getAddress", (req, res) => {
      DEBUG && console.log("/getAddress fires!");
      coinbase.getAddress((address) => {
         res.send(address)
      })
   })

   //5) 
   routes.post("/buyItem/", Auth, (req, res) => {
      DEBUG && console.log("\x1b[32mDEBUG: \x1b[0mbuyItem route fires! ");
      const { _id, username } = req.user;
      const Userinfo = req.session[_id];

      if (!Userinfo.emailverified) {
         signToken(req, Userinfo, expiredIn)
         .then(refId => {
            mail({ hostname: req.headers.origin, user: Userinfo, token: refId }, 0);
            return res.status(401).send("Email is not verified, please verified your email address");
         })
         .catch(err => {
            ServErr(res, err);
         });
      }

      DEBUG && console.log(Userinfo);
      if (req.body.btcAddress.length >= "25" && (req.body.btcAddress[0] == "1" || req.body.btcAddress[0] == "0" || req.body.btcAddress[0] == "b")) {
         let 下 = {
            "currency": "USD",
            "amountRecieved": 10,
            "btcAddress": req.body.btcAddress,
            "mailAddress": req.body.mailAddress,
            "ebayId": req.body.ebayId
         };
         //8) check transaction every 10 seconds, 
         let counter15Min = 90;
         let transactionIntervalCheck = setInterval(() => {
            DEBUG && console.log("\x1b[32mDEBUG: \x1b[0mcheck transaction (interval 10 seconds): start");
            coinbase.checkTransaction(下.btcAddress, (transaction) => {
               DEBUG && console.log(transaction);
               if (transaction[0] && transaction[0].status == "completed") {
                  DEBUG && console.log("\x1b[32mDEBUG: \x1b[0mTransaction status: completed");
                  clearInterval(transactionIntervalCheck);
                  eBay.findDetails(下.ebayId, (price) => {
                     DEBUG && console.log("\x1b[32mDEBUG: \x1b[0mFind details about item");
                     eBay.buyItem(下.ebayId, price, (status) => {
                        DEBUG && console.log("\x1b[32mDEBUG: \x1b[0mtatus of purchase from buyItem(): " + status);
                        CRUD.updatePush(_id, { "orders": 下 })
                        .then(data => {
                           DEBUG && console.log("\x1b[32mDEBUG: \x1b[0mAdd order information to the DB");
                           currentSocket.emit(currentClientId, "completed!");
                           res.send(status);
                           return signToken(req, data, expiredIn);
                        }).catch(console.log.bind(console));
                     });
                  });
               }
               //we have to create a client-side counter also
               counter15Min--;
               if (!counter15Min) {
                  currentSocket.emit(currentClientId, "timeout");
                  clearInterval(transactionIntervalCheck);
                  res.status(410);
               }
            });
            console.log("Current client id: "+ currentClientId);
            currentSocket.emit(currentClientId, "Not completed");
         }, 10000);
      }
      else {
         //send error to user because we got wrong BTC address,  (we have to change status code to appropriate DONE)
         res.status(422).send("incorrect bitcoin address");
      };

   });

   routes.get("/find/:keyword/:category?", (req, res) => {
      DEBUG && console.log("\x1b[32mDEBUG: \x1b[0mFind route fires");
      DEBUG && console.log("\x1b[32mDEBUG: \x1b[0m" + req.params.category);
      eBay.findItems(req.params.keyword, req.params.category, (items) => {
         res.send(JSON.parse(items.body).itemSummaries)
      });
   })

   return routes;
}

console.log("apiBying controller: \x1b[32mloaded!\x1b[0m");
