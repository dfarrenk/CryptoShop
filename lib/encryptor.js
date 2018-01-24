const Bcrypt = require("bcrypt");
const Uid = require("uid-safe").sync;

function hashPassAndKey(pass, user) {
	return new Promise((resolve, reject) => {
		const saltRounds = 10;
		const uid = Uid(24);
		const publickey = `${uid} - ${user}`;
		let salt = "",
			hash = "";

		Bcrypt.genSalt(saltRounds)
			.then(res => {
				salt = res;
				return Bcrypt.hash(pass, salt);
			})
			.then(res => {
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
