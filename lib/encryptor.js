const DEBUG = false;
const Bcrypt = require("bcrypt");
const Uid = require("uid-safe").sync;

function hashPassAndKey(pass, username) {
	return new Promise((resolve, reject) => {
		const saltRounds = 10;
		const uid = Uid(24);
		const publickey = `${uid} - ${username}`;
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

		DEBUG && console.log(user);
		DEBUG && console.log(pass);
		
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
console.log("Encryptor: \x1b[32mloaded!\x1b[0m");