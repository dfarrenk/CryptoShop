var bodyParser = require("body-parser");
var Join = require("path").join;
var express = require("express");
var app = express();

const _ = require("lodash");
const CookieParser = require("cookie-parser");
const Passport = require("./config/jwt.js");
const Jwt = require("jsonwebtoken");
const jwtConfig = require("./config/jwt_config.js");

var PORT = process.env.PORT || 8080;

const http = require("http"); // with this pattern we can easily switch to https later
const server = http.createServer(app); // with this pattern we can easily switch to https later

// const static = Join(__dirname, "./cryptoshopreact/public");
// app.use(express.static(static));
// app.use("*", express.static(static));

app.use(Passport.initialize());
app.use(CookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

server.listen(PORT, function(err) {
	console.log("Server started at: %s", server.address().port);
});

app.get("/", (req, res) => {
	console.log(req.path);
	res.send("Crypto shop");
});

/*

@jwt-testing bench

@use-Users object to test login

*/

const Users = [
	{
		_id: 1,
		username: "71emj",
		password: "11111111"
	},
	{
		_id: 2,
		username: "timjeng",
		password: "22222222"
	}
];

app.get("/login", (req, res) => {
	
	res.clearCookie("jwt-token");
	console.log(req.path);
	// res.send("/login");
	res.sendFile(Join(__dirname, "./cryptoshopreact/public/login.html"));
});

app.post("/login", function(req, res) {
	console.log(req.body);
	const { username: name, password } = req.body;

	if (!name || !password) {
		res.status(401).send("Error 401, required user to filled up the form before post");
		return;
	}

	// usually this would be a database call:
	const user = Users[_.findIndex(Users, { username: name })];

	if (!user) {
		res.status(401).json({ message: "no such user found" });
	}

	if (user.password === password) {
		// from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
		const payload = { _id: user._id };
		const token = Jwt.sign(payload, jwtConfig.secretOrKey);

		res.cookie("jwt-token", token);
		res.json({ message: "ok", token: token });
	} else {
		res.status(401).json({ message: "passwords did not match" });
	}
});

app.get("/user", Passport.authenticate("jwt", { session: false }), function(req, res) {

	res.status(200).send("Success! You can not see this without a token");
});

