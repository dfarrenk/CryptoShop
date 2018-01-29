var Join = require("path").join;
var bodyParser = require("body-parser");
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

const _ = require("lodash");
const ExpSess = require("express-session");
const ForceSSL = require("express-force-ssl");
const Passport = require("./config/jwt.js");
const {
   server_config: serConf,
   session_config: sessConf,
   https_config: httpsConf,
   forceSSL_config: fsslConf,
   store_config: storeConf,
   memoryStore
} = require("./config/config.js");
const { port: PORT, httpsPort: PORTs, mongoURL } = serConf;


// http/https setup
const http = require("http");
const server = http.createServer(app);
const https = require("https");
const certificate = httpsConf;
const server_s = https.createServer(certificate, app);

// static
const staticPath = Join(__dirname, "view");
app.use(express.static("public"));
app.use(express.static(staticPath));
app.use("*", express.static(staticPath));

// handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Connect to the Mongo DB
var MONGODB_URI = mongoURL;
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.use(Passport.initialize());
app.use(ExpSess(sessConf));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("forceSSLOptions", fsslConf);
app.use(ForceSSL);

// all routers
app.all("*", require("./controllers")); 

server.listen(PORT, function(err) {
   console.log("Server started at: %s", server.address().port);
});

server_s.listen(PORTs, function(err) {
   memoryStore.garbageCollector();
   console.log("Https server running on port %s", server_s.address().port);
   console.log("\x1b[32mI'm ready to serve you, my master!\x1b[0m")
});