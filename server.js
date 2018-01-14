var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var PORT = 8080;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.listen(PORT, function(){
	console.log("Server started at:" +PORT);
})
app.get("/", (req, res)=>{
	console.log("/");
	res.send("Crypto shop");
})