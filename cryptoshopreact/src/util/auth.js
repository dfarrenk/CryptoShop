import axios from "axios";
import Validator from "./validate";

const validator = new Validator();

const login = fields => {
	return new Promise((resolve, reject) => {
		const { username, password } = fields;
		const data = { username, password };

		if (username.match(/(.*?@[a-z]+\.[a-z]+)+$/g)) {
			console.log("it's email format");
			data.email = username;
			delete data.username;
		}

		const invalid = validator.setFields(data).validate();
		if (invalid) {
			console.log(invalid);
			return reject(invalid);
		}

		resolve(axios.post("/login", data));
	});
};

const register = fields => {
	return new Promise((resolve, reject) => {
		const { email, username, password, passconfirm } = fields;
		const data = { username, email, password, passconfirm };

		const invalid = validator.setFields(data).validate();
		if (invalid) {
			console.log(invalid);
			return reject(invalid);
		}

		delete data.passconfirm;
		resolve(axios.post("/register", data));
	});
};

const reset = fields => {
	return new Promise((resolve, reject) => {
		const { username, email } = fields;
		const data = { username, email };

		const invalid = validator.setFields(data).validate();
		if (invalid) {
			console.log(invalid);
			return reject(invalid);
		}

		resolve(axios.post("/user/forgotPass", data));
	});
}

const update = fields => {
	return new Promise((resolve, reject) => {
		const { originalpass, password, email } = fields;
		const data = { email, password: originalpass };

		if (password) {
			console.log("it's password mode");
			data.newpassword = password;
			delete data.email;
		}

		const invalid = validator.setFields(data).validate();
		if (invalid) {
			console.log(invalid);
			return reject(invalid);
		}

		resolve(axios.post("/user/forgotPass", data));
	});
}

export { login, register, reset, update };