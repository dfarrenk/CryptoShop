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

const resetreq = fields => {
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
};

const reset = fields => {
	return new Promise((resolve, reject) => {
		const { username, password, passconfirm } = fields;
		const data = { username, password, passconfirm };
		
		const invalid = validator.setFields(data).validate();
		if (invalid) {
			console.log(invalid);
			return reject(invalid);
		}
		resolve(axios.put("/user/resetPass" + window.location.search, data));
	});
};

const update = fields => {
	return new Promise((resolve, reject) => {
		const { originalpass, password, passconfirm, email } = fields;
		const data = { email, originalpass };
		let url = "/user/changeEmail";

		if (!email) {
			console.log("it's password mode");
			url = "/user/changePass";
			data.password = password;
			data.passconfirm = passconfirm;
			delete data.email;
		} 
		
		const invalid = validator.setFields(data).validate();
		if (invalid) {
			console.log(invalid);
			return reject(invalid);
		}
	
		delete data.passconfirm;
		resolve(axios.put(url, data));
	});
};

export { login, register, resetreq, reset, update };	