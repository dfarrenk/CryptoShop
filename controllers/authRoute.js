const Passport = require("../config/jwt.js");
const authRoute = require("express").Router();

const _ = require("lodash");
const hash = require("../lib/encryptor.js");
const signToken = require("../lib/signToken.js");

module.exports = function() {
	authRoute.post("/login", function(req, res) {
		// console.log(req.body);
		const { username, password, email } = req.body;

		// usually this would be a database call:
		const searchField = email ? { email } : { username };
		const user = Users[_.findIndex(Users, searchField)];

		if (!user) {
			res.status(401).json({ message: "no such user found" });
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

	authRoute.post("/register", function(req, res) {
		console.log(req.body);
		const { username, password, email } = req.body;

		hash
			.create(password, username)
			.then(({ salt, hash, publicKey }) => {
				const userData = {
					username,
					email,
					salt,
					publicKey,
					password: hash,
					_id: Users.length + 1
				};
				return Promise.resolve(Users.concat(userData)); // should be mongo
			})
			.then(dataBase => {
				console.log(dataBase);
				const user = dataBase[_.findIndex(dataBase, { username })];

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

// temp database sim
const Users = [
	{
		_id: 1,
		username: "71emj",
		email: "tim.jeng@gmail.com",
		password: "11111111",
		publicKey: "iam71emj"
	},
	{
		_id: 2,
		username: "timjeng",
		email: "tim.jeng@outlook.com",
		password: "22222222",
		publicKey: "iamtimjeng"
	}
];
