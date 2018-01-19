const Jwt = require("jsonwebtoken");
const { jwt_config: config } = require("../config/config.js")("dev");

module.exports = function(user, session, timeout) {
	const payload = { _id: user._id };
	const key = user.publickey;
	const privToken = Jwt.sign(payload, config.secretOrKey);
	const token = Jwt.sign({ 
		token: privToken,
	}, key, { expiresIn: timeout });

	session.authenticated = true;
	session.key = key;
	session.token = token;

	return true;
};
