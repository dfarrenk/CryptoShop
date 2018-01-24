var Join = require("path").join;
var bodyParser = require("body-parser");
var express = require("express");
var app = express();
// var Bitpay = require("bitpay-api");
// var bitpay = new Bitpay();
var mongoose = require("mongoose");
var db = require("./models");

var blockexplorer = require("blockchain.info/blockexplorer"); //another way to get a TXID confirmation

const _ = require("lodash");
const ExpSess = require("express-session");
// const MongoStore = require("connect-mongo")(ExpSess);
const ForceSSL = require("express-force-ssl");
const Passport = require("./config/jwt.js");
const {
   server_config: serConf,
   session_config: sessConf,
   https_config: httpsConf,
   forceSSL_config: fsslConf,
   store_config: storeConf
} = require("./config/config.js");
const { port: PORT, httpsPort: PORTs, mongoURL } = serConf;

const http = require("http");
const server = http.createServer(app);

// https setup
const https = require("https");
const certificate = httpsConf;
const server_s = https.createServer(certificate, app);

const static = Join(__dirname, "./view");
app.use(express.static(static));
app.use("*", express.static(static));

// Connect to the Mongo DB
var MONGODB_URI = mongoURL;
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.use(Passport.initialize());
app.use(ExpSess(sessConf));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("forceSSLOptions", fsslConf);

// app.use(ForceSSL);

app.all("*", require("./controllers")); // all router

server.listen(PORT, function(err) {
   console.log("Server started at: %s", server.address().port);
});

server_s.listen(PORTs, function(err) {
   console.log("Https server running on port %s", server_s.address().port);
});

app.get("/", (req, res) => {
   console.log("/");
   res.sendFile(Join(__dirname, "./view/homepage.html"));
});

app.get("/txid/:TXID", (req, res) => {
   res.send(blockexplorer.getTx(req.params.TXID));
});

/*

@jwt-testing bench

@use-Users object to test login

*/

app.get("/login", (req, res) => {
   // console.log(req.session);
   console.log("get");
   // res.clearCookie("jwt-token");
   console.log(req.path);
   console.log(req.session.id);
   // res.send("/login");
   res.sendFile(Join(__dirname, "./cryptoshopreact/public/login.html"));
   // res.sendFile(Join(__dirname, "./cryptoshopreact/public/index.html"));
});

app.post("/api/user", function(req, res) {
   console.log(req);
   //var query = {'username':req.user.username};
   //var query - ('_id': req.user._id);
   req.newData.username = req.user.username;
   // req.newData.field = req.user.field;
   db.User.findOneAndUpdate(query, req.newData, function(err, doc) {
      if (err) return res.send(500, { error: err });
      return res.send("succesfully saved");
   });
});

//Test route for getting Users from MongoDB. It will pull all user documents from the 'users' collection in the 'crypto' database.
app.get("/api/user", function(req, res) {
   db.User.find({})
      .then(function(dbUser) {
         res.json(dbUser);
      })
      .catch(function(err) {
         res.json(err);
      });
});

//Test route to add a User
app.get("/api/user/testUser", function(req, res) {
   console.log("herer");
   let testUser = { name: "testUser", password: "1234", email: "testUser@gmail.com" };
   db.User.create(testUser).then(function(res) {
      console.log(`User inserted`);
      res.status(200).json(res);
   });
});

app.get("/search/:id", function(req, res) {
   let searchTerm = req.params.id;
   res.status(200).send("/searchPage.html?item=" + searchTerm);
});


app.put("/api/user", function(req, res) {
   console.log(req.body);
});