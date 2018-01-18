import axios from "axios";
import Validator from "./validate";

const login = fields => {
	return new Promise((resolve, reject) => {
		const { email, username, password } = fields;
		const validator = new Validator();
		const data = {
			username: username,
			email: email,
			password: password
		};

		email ? delete data.username : delete data.email;

		validator.Setprops = data;
		const invalid = validator.validate();
		if (invalid) {
			return reject("THIs is invalid: " + invalid);
		}

		resolve(axios.post("/login", data));
	});
};

const register = fields => {
	const { email, username, password, passconfirm } = fields;

	const data = {
		username: username,
		email: email,
		password: password
	};

	return axios.post("/register", data);
};

export { login, register };
