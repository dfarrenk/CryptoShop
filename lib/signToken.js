const Jwt = require("jsonwebtoken");
const db = require("../models");
const Users = require("../models").User;
const { jwt_config: config } = require("../config/config.js")("dev");

module.exports = function(req, user, timeout) {
	return new Promise((resolve, reject) => {
		const session = req.session;
		const payload = { _id: user._id };
		const key = user.publickey;
		const privToken = Jwt.sign(payload, config.secretOrKey);
		const token = Jwt.sign({
			token: privToken
		}, key, { expiresIn: timeout });

		if (!user.sid) {
			

			////// serious serious async issue with session.regenerate
			Promise.resolve(session.regenerate(function(err) {
				console.log(err);
			})).then(sess => {
				console.log("--------------------------------");
				// console.log(s);
				// const sess = req.session;

				console.log("Okay transformed.....what's the id now");
				// console.log(req);
				console.log(req.sessUid);
				console.log(sess);

				sess.authenticated = true;
				sess.key = key;
				sess.token = token;
				sess.uid = req.sessUid;
				const txid = [{
					TXID: user.name
				}, {
					TXID: user.email
				}];
					
				console.log(sess);

				sess.testArr ? sess.testArr.concat(txid) : (sess.testArr = txid);
				console.log("what did i miss");
				console.log(req.sessUid);
				// resolve(true);
				setTimeout(resolve, 5000);

				// process.nextTick(() => {
				// 	process.nextTick(resolve);
				// });
				// Users
				// 	.findOneAndUpdate({ 
				// 		"_id": user.id 
				// 	}, {
				// 		$set: { "sid": req.sessUid }
				// 	})
				// 	.then(data => {
				// 		console.log("I don't understand");
				// 		console.log(data);
				// 		resolve(true);
				// 	})
				// 	.catch(console.log.bind(console));

				})
		} else {
			console.log("something");
			Promise.resolve(session.reload(user.sid)).then(sess => {
				console.log(sess);
				resolve();
			});
		}
	});
};

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});



// function SessionLogin(data, callback) {
// 	const req = this.req;
// 	req.session.regenerate(err => {});

// 	// req.session.userInfo = user;
// 	callback();
// }



	

	

			// session.login(token, console.log.bind(console));
			// console.log(session.id);
			// session.authenticated = true;
			// session.key = key;
			// session.token = token;
			// const txid = [{
			// 	TXID: user.name
			// }, {
			// 	TXID: user.email
			// }];

			// session.testArr ? session.testArr.concat(txid) : (session.testArr = txid);
			
			// Users
			// 	.findOneAndUpdate(
			// 		{ _id: user.id },
			// 		{ $set: { sid: req.sessUid } }
			// 	)
			// 	.then(resolve)
			// 	.catch(console.log.bind(console));