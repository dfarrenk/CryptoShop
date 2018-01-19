const Passport = require("passport");
const PassportJwt = require("passport-jwt");
const JwtStrategy = PassportJwt.Strategy;

const { jwt_config: config } = require("./config.js")("dev");
const Users = require("../models").User;

const strategy = new JwtStrategy(config, function(jwt_payload, next) {
	console.log("this is payload", jwt_payload);

	Users.findOne({ _id: jwt_payload._id }).then(user => {
		if (!user) {
			return next(null, false);
		}
		return next(null, user);
	});
});

Passport.use(strategy);

module.exports = Passport;
