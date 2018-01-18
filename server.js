var bodyParser = require("body-parser");
var Join = require("path").join;
var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;
var Bitpay = require("bitpay-api");
var bitpay = new Bitpay();
var mongoose = require("mongoose");
var db = require("./models");

var blockexplorer = require("blockchain.info/blockexplorer"); //another way to get a TXID confirmation

const _ = require("lodash");
const CookieParser = require("cookie-parser");
const ExpSess = require("express-session");
const Passport = require("./config/jwt.js");
const { serOpts: serConf, sessOpts: sessConf } = require("./config/config.js")("dev");

const http = require("http"); // with this pattern we can easily switch to https later
const server = http.createServer(app); // with this pattern we can easily switch to https later

// const static = Join(__dirname, "./cryptoshopreact/public");
// app.use(express.static(static));
// app.use("*", express.static(static));

app.use(Passport.initialize());
app.use(ExpSess(sessConf));

// app.use(CookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.all("*", require("./controllers")); // all router

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/crypto";
mongoose.connect(MONGODB_URI);


server.listen(PORT, function(err) {
	console.log("Server started at: %s", server.address().port);
});

app.get("/", (req, res) => {
	console.log("/");
	bitpay.getBTCBestBidRates(function(err, rates) {
		res.send("Crypto shop\n" + rates[1].name + " : " + rates[1].rate);
	});
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
	// res.send("/login");
	res.sendFile(Join(__dirname, "./cryptoshopreact/public/login.html"));
	// res.sendFile(Join(__dirname, "./cryptoshopreact/public/index.html"));
});

//Test route for getting Users from MongoDB. It will pull all user documents from the 'users' collection in the 'crypto' database.
app.get("/api/user", function(req, res) {
	db.User
		.find({})
		.then(function(dbUser) {
			res.json(dbUser);	
		})
		.catch(function(err) {
			res.json(err);
		});
});

//Test route to add a User
app.get("/api/user/testUser", function(req, res) {
	let testUser = { name: "testUser", password: "1234", email: "testUser@gmail.com"};
	db.User
		.create(testUser)
		.then(function() {
			console.log(`User inserted`);
		});
	
});

