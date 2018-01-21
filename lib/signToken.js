const Jwt = require("jsonwebtoken");
const db = require("../models");
const Users = require("../models").User;
const { jwt_config: config } = require("../config/config");

module.exports = function(req, user, timeout) {
	return new Promise((resolve, reject) => {
		const payload = { _id: user._id };
		const key = user.publickey;
		const privToken = Jwt.sign(payload, config.secretOrKey);
		const token = Jwt.sign(
			{
				token: privToken
			},
			key,
			{ expiresIn: timeout }
		);

		req.session.regenerate(function(err) {
			console.log(err);

			req.session.authenticated = true;
			req.session.key = key;
			req.session.token = token;
			req.session.txid = user.txid;

			resolve(true);
		});
	});
};

process.on("unhandledRejection", (reason, p) => {
	console.log("Unhandled Rejection at:", p, "reason:", reason);
	// application specific logging, throwing an error, or other logic here
});
