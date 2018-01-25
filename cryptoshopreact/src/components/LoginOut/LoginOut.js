import React, { Component } from "react";
import { login, register, reset } from "../../util/auth";
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
			isLogin: true,
			resetPass: false
		};
	}

	inputHandler = evt => {
		const { name, value } = evt.target;
		this.setState({ [name]: value });
	};

	submitHandler = evt => {
		evt.preventDefault();
		const { isLogin, resetPass, fields } = this.state;

		for (let elem in fields) {
			delete fields[elem].err;
		}

		if (resetPass) {
			reset(this.state)
				.then(this.responseHandler)
				.catch(err => this.validationHandler(err, fields));
		} else {
			isLogin
			? login(this.state)
					.then(this.responseHandler)
					.catch(err => this.validationHandler(err, fields))
			: register(this.state)
					.then(this.responseHandler)
					.catch(err => this.validationHandler(err, fields));
		}

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

		/////////////////////// need to clear crresponding input field to display error //////////////////////////////

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
	};

	responseHandler = response => {
		console.log(response);
		if (response.status === 200) {
			window.location.assign("/"); 
		}
	};

	renFooter() {
		const { isLogin, resetPass } = this.state;
		const msg = isLogin ? "New User?" : "Already Registered?";

		const fetchOptions = {
			method: "PUT", // or "PUT"
			headers: new Headers({
				"Content-Type": "application/text"
			})
		};

		return (
			<p key="footer" className="--anchor">
				{
					isLogin
					? [ 
						<a key="forgotpass" onClick={() => this.setState({ resetPass: !resetPass })}>Forgot Your Password?</a>, 
						<span key="backslash"> / </span>
						]
					: ""
				}
				<a key="userchoice" onClick={() => this.setState({ isLogin: !isLogin })}>{msg}</a>
			</p>
		);
	}

	renResetPass() {
		const { username, email } = this.state.fields;
		username.val = "please let us know your username";
		email.val = "and the email you use to register";
		const resetFields = [username, email];

		console.log(resetFields);
		return this.renderFields(resetFields);
	}

	renLogin() {
		const { username, password } = this.state.fields;
		username.val = "username or email";
		password.val = "password";
		const loginFields = [username, password];

		return this.renderFields(loginFields);
	}

	renRegister() {
		const { username, password, email, passconfirm } = this.state.fields;
		const registerFields = [username, email, password, passconfirm];

		return this.renderFields(registerFields);
	}

	renderFields(args) {
		const fields = args.map((elem, index) => {
			return (
				<div key={index} className="form-group">
					<label htmlFor={elem.name}>{elem.label}</label>
					<input
						type={elem.type}
						onChange={this.inputHandler}
						name={elem.name}
						id={elem.name}
						placeholder={elem.err || elem.val}
						className={`form-control ${elem.err && "err"}`}
						value={this.state[elem.name]}
					/>
				</div>
			);
		});

		return fields;
	}

	render() {
		const { isLogin, resetPass } = this.state;

		return (
			<form onSubmit={this.submitHandler} className="card">
				{
					!resetPass
					? [
							isLogin ? this.renLogin() : this.renRegister(),
							<input key="submit" type="submit" value={isLogin ? "Login" : "Register"} />,
							this.renFooter()
						]
					: [
							this.renResetPass(),
							<input key="submitReset" type="submit" value="Confirm" />,
							<p key="footer" className="--anchor">
								<a onClick={() => this.setState({ resetPass: !resetPass })}>Never Mind</a>
							</p>
						]
				}
			</form>
		);
	}
}

export default Login;
