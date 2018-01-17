import React, { Component } from "react";
import { login, register } from "./util/auth";
import "./style.css";

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: null,
			password: null,
			passconfirm: null,
			email: null,
			isLogin: true
		};
	}

	inputHandler = evt => {
		let { name, value } = evt.target;

		if (value.match(/(.*?@[a-z]+\.[a-z]+)+$/g)) {
			name = "email";
		}

		this.setState({
			[name]: value
		});
	};

	submitHandler = evt => {
		evt.preventDefault();
		const isLogin = evt.target.value === "Login";

		isLogin
			? login(this.state).then(this.responseHandler)
			: register(this.state).then(this.responseHandler);

		console.log(this.state);
	};

	responseHandler = (response) => {
		console.log(response);
	}

	renFooter() {
		const { isLogin } = this.state;
		const msg = isLogin ? "New User?" : "Already Registered?";

		return <a onClick={() => this.setState({ isLogin: !isLogin })}>{msg}</a>;
	}

	renLogin() {
		const fields = [
			{
				name: "username",
				val: "Username or Email"
			},
			{
				name: "password",
				val: "Password",
				type: "password"
			}
		];

		return this.renderFields(fields);
	}

	renRegister() {
		const fields = [
			{
				name: "username",
				val: "Username"
			},
			{
				name: "email",
				val: "Email Address",
				type: "email"
			},
			{
				name: "password",
				val: "Password",
				type: "password"
			},
			{
				name: "passwordconfirm",
				val: "Confirm Your Password",
				type: "password"
			}
		];

		return this.renderFields(fields);
	}

	renderFields(args) {
		const fields = args.map((elem, index) => {
			return (
				<div key={index} className="form-group">
					<label htmlFor={elem.name}>
						{elem.name.replace(/\b\w/g, elem => elem.toUpperCase()) + ": "}
					</label>
					<input
						type={elem.type ? elem.type : "text"}
						onChange={this.inputHandler}
						name={elem.name}
						id={elem.name}
						placeholder={elem.val}
						className="form-control"
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
