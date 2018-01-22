const Jwt = require("jsonwebtoken");
const db = require("../models");
const Uid = require("uid-safe").sync;
const _ = require("lodash");
const { jwt_config: config, authUser: memoryStore } = require("../config/config");

module.exports = function(req, user, timeout) {
	return new Promise((resolve, reject) => {
		const { _id, userName, realName, address, email, orders, txid } = user;
		const refId = Uid(24);
		const payload = { $id: refId };
		const key = user.publickey;
		const privToken = Jwt.sign(payload, config.secretOrKey);
		const token = Jwt.sign({
			token: privToken
		}, key, { expiresIn: timeout });

		req.session.regenerate(function(err) {
			console.log(err);

			req.session.authenticated = true;
			req.session.user = { key, token };
			req.session[_id] = { userName, realName, address, email, orders, txid };

			// use lodash function to find whether the user already loggin elsewhere
			// this prevents multiple location loggin && increase security measure with tradeoff of 
			// being slightly inconveninet
			const isExisted = _.findKey(memoryStore, function(elem) { return elem.userName === userName });
			if (isExisted) {
				delete memoryStore[isExisted];
			}
			memoryStore[refId] = { userName, _id };
			
			resolve(true);
		});
	});
};

process.on("unhandledRejection", (reason, p) => {
	console.log("Unhandled Rejection at:", p, "reason:", reason);
	// application specific logging, throwing an error, or other logic here
});
