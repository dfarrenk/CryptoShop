import React, { Component } from "react";
import { login, register } from "./util/auth";
import fields from "./authconfig.json";
import "./style.css";

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			passconfirm: "",
			email: "",
			fields: fields,
			isLogin: true
		};
	}

	inputHandler = evt => {
		const { name, value } = evt.target;
		this.setState({ [name]: value });
	};

	submitHandler = evt => {
		evt.preventDefault();
		const { isLogin, fields } = this.state;

		for (let elem in fields) {
			delete fields[elem].err;
		}

		isLogin
			? login(this.state)
					.then(this.responseHandler)
					.catch(err => this.validationHandler(err, fields))
			: register(this.state)
					.then(this.responseHandler)
					.catch(err => this.validationHandler(err, fields));

		console.log(this.state);

		this.setState({
			password: "",
			passconfirm: ""
		});
	};

	validationHandler = (error, fields) => {
		const errMsg = (e, keyword) => {
			let errname = null;

			e.match(/email/) && (errname = "email");
			e.match(/user?(name|)/) && (errname = "username");
			e.match(/password/) && (errname = "password");
			e.match(/passconfirm/) && (errname = "passconfirm");
			
			fields[errname].err = `${keyword} ${errname}`;
			this.setState({ fields: fields });
		};
		
		if (error.response) {
			return this.serverError(error.response);
		}

		const e = error;
		switch (true) {
			case !!e.match(/missing/):
				errMsg(e, "missing");
				break;
			case !!e.match(/invalid/):
				errMsg(e, "invalid");
				break;
			case !!e.match(/mismatched/):
				errMsg(e, "mismatched");
				break;
			default:
				console.log("wrong place");
		}
	};

	serverError = error => {
		const { data: e, status } = error;

		console.log(e.message);
	}

	responseHandler = response => {
		console.log(response);
		if (response.status === 200) {
			window.location.assign("/"); // not working as expected
		}
	};

	renFooter() {
		const { isLogin } = this.state;
		const msg = isLogin ? "New User?" : "Already Registered?";

		return <a onClick={() => this.setState({ isLogin: !isLogin })}>{msg}</a>;
	}

	renLogin() {
		const { username, password } = this.state.fields;
		username.val = "username or email";
		password.val = "password";
		const loginFields = [ username, password ];

		return this.renderFields(loginFields);
	}

	renRegister() {
		const { username, password, email, passconfirm } = this.state.fields;
		const registerFields = [ username, email, password, passconfirm ];

		return this.renderFields(registerFields);
	}

	renderFields(args) {
		const fields = args.map((elem, index) => {
			return (
				<div key={index} className="form-group">
					<label htmlFor={elem.name}>
						{elem.label}
					</label>
					<input
						type={elem.type}
						onChange={this.inputHandler}
						name={elem.name}
						id={elem.name}
						placeholder={elem.err || elem.val}
						className="form-control"
						value={this.state[elem.name]}
					/>
				</div>
			);
		});

		return fields;
	}

	render() {
		const { isLogin } = this.state;

		return (
			<form onSubmit={this.submitHandler} className="card">
				{isLogin ? this.renLogin() : this.renRegister()}
				<input type="submit" value={isLogin ? "Login" : "Register"} />
				{this.renFooter()}
			</form>
		);
	}
}

export default Login;