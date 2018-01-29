import React, { Component } from "react";
import Form from "../Form";
import ErrorHandler from "../../util/errorhandler";
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
	}

	submitHandler = evt => {
		evt.preventDefault();
		const { isLogin, resetPass, fields } = this.state;

		for (let elem in fields) {
			delete fields[elem].err;
		}

		switch (true) {
			case resetPass:
				reset(this.state)
				.then(res => {
					const { status } = res;
					if (status === 204 || status === 304) {
						console.log(res);
						throw res;
					}
					this.responseHandler(res);
				})
				.catch(err => this.validationHandler(err, fields));
				break;
			case isLogin:
				login(this.state)
				.then(res => {
					const { status } = res;
					if (status === 204 || status === 304) {
						throw res;
					}
					this.responseHandler(res);
				})
				.catch(err => this.validationHandler(err, fields));
				break;
			case !isLogin:
				register(this.state)
				.then(res => {
					const { status } = res;
					if (status === 204 || status === 304) {
						throw res;
					}
					this.responseHandler(res);
				})
				.catch(err => this.validationHandler(err, fields));
				break;
			default:
				console.log("hmmn...this is an exception");
		}

		console.log(this.state);
		this.setState({
			password: "",
			passconfirm: ""
		});
	}

	validationHandler = (error, fields) => {
		const errorhandler = new ErrorHandler();
		errorhandler
			.getError(error)
			.errorHandling()
			.then(errType => {
				let { field, message } = errType;

				if (!field) {
					// this is where we decided what to do with server error
					fields.username.err = message;
					field = "username";
				} else {
					fields[field].err = message;
				}
				this.setState({
					[field]: "",
					fields: fields
				});
			});
	}

	responseHandler = response => {
		console.log(response);
		if (response.status < 300) {
			window.location.assign("/");
		}
	}

	clearFields = (resetname, value) => {
		for (let elem in fields) {
			delete fields[elem].err;
		}

		this.setState({
			reset: true,
			username: "",
			password: "",
			passconfirm: "",
			email: "",
			[resetname]: value
		});
	}

	renFooter() {
		const { isLogin, resetPass } = this.state;
		const msg = isLogin ? "New User?" : "Already Registered?";
		return (
			<p key="footer" className="--anchor">
				{isLogin
					? [
							<a key="forgotpass" onClick={() => this.clearFields("resetPass", !resetPass)}>
								Forgot Your Password?
							</a>,
							<span key="backslash"> / </span>
						]
					: ""}
				<a key="userchoice" onClick={() => this.clearFields("isLogin", !isLogin)}>
					{msg}
				</a>
			</p>
		);
	}

	renderBody() {
		const { isLogin, resetPass, fields } = this.state;
		const { username, password, email, passconfirm } = fields;

		if (resetPass) {
			username.val = "please let us know your username";
			email.val = "and the email you use to register";
			return [username, email];
		}
		if (isLogin) {
			username.val = "username or email";
			password.val = "password";
			return [username, password];
		}

		return [username, email, password, passconfirm];
	}

	render() {
		const { isLogin, resetPass } = this.state;
		let name = isLogin ? "Login" : "Register";
		let footer = this.renFooter();

		if (resetPass) {
			name = "Confirm";
			footer = (
				<p key="footer" className="--anchor">
					<a onClick={() => this.clearFields("resetPass", !resetPass)}>Never Mind...</a>
				</p>
			);
		};

		return (
			<Form
				fields={this.renderBody()}
				submit={this.submitHandler}
				input={this.inputHandler}
				className="card"
				name={name}
				footer={footer}
				states={this.state}
			/>
		);
	}
}

export default Login;