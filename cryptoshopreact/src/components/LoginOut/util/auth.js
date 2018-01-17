import axios from "axios";

const login = (fields) => {
	const { email, username, password } = fields;
	const data = {
		username: username,
		email: email,
		password: password
	};

	email ? delete data.username : delete data.email;

	return axios.post("/login", data);
}

const register = (fields) => {
	const { email, username, password } = fields;
	const data = {
		username: username,
		email: email,
		password: password
	};

	return axios.post("/register", data);
}

const validation = () => {
	return;
}


export { login, register, validation };
