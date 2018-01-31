import React from "react";
import Form from "../Form";
import { default as Auth } from "../Authentication";
import { login, register, resetreq } from "../../util/auth";
import fields from "./authconfig.json";
import "./style.css";

class Login extends Auth {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			passconfirm: "",
			email: "",
			fields: fields,
			isLogin: true,
			checkbox: false,
			resetPass: false
		};
	}

	submitHandler = evt => {
		evt.preventDefault();
		const { isLogin, resetPass, checkbox, fields } = this.state;

		for (let elem in fields) {
			delete fields[elem].err;
		}

		if (!isLogin && !checkbox) {
			return this.props.result("error", "please confirm you have read and agreed to our terms");
		}

		switch (true) {
			case resetPass:
				resetreq(this.state)
				.then(res => {
					const { status, data } = res;
					if (status === 204 || status === 304) {
						throw res;
					}
					this.responseHandler("reload", data.reload);
				})
				.catch(err => this.validationHandler(err, fields));
				break;
			case isLogin:
				login(this.state)
				.then(res => {
					const { status, data } = res;
					if (status === 204 || status === 304) {
						throw res;
					}
					console.log(res);
					this.responseHandler("assign", data.redirect);
				})
				.catch(err => this.validationHandler(err, fields));
				break;
			case !isLogin:
				register(this.state)
				.then(res => {
					const { status, data } = res;
					if (status === 204 || status === 304) {
						throw res;
					}
					this.responseHandler("assign", data.redirect);
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

	clearFields = (resetname, value) => {
		for (let elem in fields) {
			delete fields[elem].err;
		}

		const setfields = {
			username: "",
			password: "",
			passconfirm: "",
			email: "",
			[resetname]: value
		};
		Promise
			.resolve(this.setState(setfields))
			.then(this.setflag.bind(this))
			.catch(console.log.bind(console));
	}

	setflag() {
		const { isLogin, resetPass } = this.state;
		if (resetPass) {
			return this.props.flag("user", "forgot");
		}
		if (isLogin) {
			return this.props.flag("user", "login");
		}
		return this.props.flag("user", "register");
	}

	renFooter() {
		const { isLogin, resetPass } = this.state;
		const msg = isLogin ? "New User?" : "Already Registered?";
		return (
			<p key="footer" className="--anchor float-right">
				{isLogin
					? [
							<a key="forgotpass" onClick={() => this.clearFields("resetPass", !resetPass)}>
								Forgot Your Password?&nbsp;
							</a>,
							<span key="backslash">/&nbsp;</span>
						]
					: ""}
				<a key="userchoice" onClick={() => this.clearFields("isLogin", !isLogin)}>
					{msg}
				</a>
			</p>
		);
	}

	renCheckbox() {
		const { checkbox } = this.state;

		return (
			<div className="form-check" >
				<input className="form-check-input" type="checkbox" id="gridCheck" onClick={ () => { this.setState({ checkbox: !checkbox }) }}/>
				<label className="form-check-label" htmlFor="gridCheck" >
					<small id="privacyHelp">
						I agree to the cryptoShop&nbsp;
						<a data-toggle="modal" data-target="#privacyPolicy" href="">
						Privacy Policy&nbsp;
						</a>
					</small>
				</label>
			</div>
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
		
		username.val = "username is your alias on our site";
		return [username, email, password, passconfirm];
	}

	render() {
		const { isLogin, resetPass } = this.state;
		let name = isLogin ? "Login" : "Register";
		let footer = this.renFooter();

		if (resetPass) {
			name = "Confirm";
			footer = (
				<p key="footer" className="--anchor float-right">
					<a onClick={() => this.clearFields("resetPass", !resetPass)}>Never Mind...</a>
				</p>
			);
		};

		return (
			<Form
				fields={this.renderBody()}
				submit={this.submitHandler}
				input={this.inputHandler}
				optional={isLogin ? "" : this.renCheckbox()}
				name={name}
				footer={footer}
				states={this.state}
			/>
		);
	}
}

export default Login;