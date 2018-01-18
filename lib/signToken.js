const Jwt = require("jsonwebtoken");
const { jwtOpts: config } = require("../config/config.js")("dev");

module.exports = function(user, session, timeout) {
	const payload = { _id: user._id };
	const key = user.publicKey;
	const privToken = Jwt.sign(payload, config.secretOrKey);
	const token = Jwt.sign({ 
		token: privToken,
	}, key, { expiresIn: timeout });

	session.authenticated = true;
	session.key = key;
	session.token = token;

	return true;
};
