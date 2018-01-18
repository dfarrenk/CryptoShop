const Passport = require("passport");
const PassportJwt = require("passport-jwt");
const JwtStrategy = PassportJwt.Strategy;
const Jwt = require("jsonwebtoken");
const Bcrypt = require("bcrypt");
const base64Url = require("base64-url");
const { jwtOpts: config } = require("./config.js")("dev");
const _ = require("lodash");

const Users = [
	{
		_id: 1,
		username: "71emj",
		email: "tim.jeng@gmail.com",
		password: "11111111"
	},
	{
		_id: 2,
		username: "timjeng",
		email: "tim.jeng@outlook.com",
		password: "22222222"
	}
];


const strategy = new JwtStrategy(config, function(jwt_payload, next) {
	console.log("this is payload", jwt_payload);

	const user = Users[_.findIndex(Users, { _id: jwt_payload._id })];

	if (!user) {
		return next(null, false);
	}

	return next(null, user);
});

Passport.use(strategy);

module.exports = Passport;
