const Passport = require("../config/jwt.js");
const authRoute = require("express").Router();

const _ = require("lodash");
const hash = require("../lib/encryptor.js");
const signToken = require("../lib/signToken.js");

const Users = require("../models").User;

module.exports = function() {

	authRoute.post("/login", function(req, res) {
		console.log(req.body);
		const { username, password, email } = req.body;
		const searchField = email ? { email } : { name: username };

		Users.findOne(searchField).then(user => {
			if (!user) {
				return res.status(401).json({ message: "no such user found" });
			}

			hash
				.compare(password, user)
				.then(isMatched => {
					if (isMatched) {
						signToken(user, req.session, 5 * 60); // sign token with private key && store in session
						console.log(req.session);

						res.status(200).json({ message: "ok", token: req.session.token });
					} else {
						res.status(401).json({ message: "passwords did not match" });
					}
				})
				.catch(err => {
					console.log(err);
					res
						.status(500)
						.send(
							"Internval Server Error. Please note that our engineer is working hard to recover it."
						);
				});
		});
	});

	authRoute.post("/register", function(req, res) {
		console.log(req.body);
		const { username, password, email } = req.body;

		hash
			.create(password, username)
			.then(({ salt, hash, publickey }) => {
				const userData = {
					name: username,
					email,
					salt,
					publickey,
					password: hash
				};
				return Users.create(userData);
			})
			.then(user => {
				signToken(user, req.session, 5 * 60);

				console.log(req.session);
				res.status(200).json({ message: "ok", token: req.session.token });
			})
			.catch(err => {
				console.log(err);
				res.status(401).send(err);
			});
	});

	authRoute.get("/user", Passport.authenticate("jwt", { session: false }), function(
		req,
		res
	) {
		// not getting get request from react
		console.log("======================================");
		console.log(req.session);
		// req.session.regenerate();

		console.log(req.session);
		res.status(200).send("Success! You can not see this without a token");
	});

	return authRoute;
};