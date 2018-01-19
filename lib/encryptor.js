const Bcrypt = require("bcrypt");
const Urlencode = require("base64-url");

function hashPassAndKey(pass, user) {
	return new Promise((resolve, reject) => {
		const saltRounds = 10;
		const pub = Urlencode.encode("Welcome to Crypto Shop");
		let salt = "",
			hash = "";

		Bcrypt.genSalt(saltRounds)
			.then(res => {
				salt = res;
				return Bcrypt.hash(pass, salt);
			})
			.then(res => {
				const publickey = `${pub} - ${user}`;
				const hash = res;
				resolve({ salt, hash, publickey });
			})
			.catch(reject);
	});
}

function compareHash(pass, user) {
	return new Promise((resolve, reject) => {
		const { password: hash } = user;
		let isMatched = null;

		Bcrypt.compare(pass, hash)
			.then(res => {
				isMatched = res;
				resolve(isMatched);
			})
			.catch(reject);
	});
}

module.exports = { create: hashPassAndKey, compare: compareHash };
