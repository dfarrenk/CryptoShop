import React, { Component } from "react";
import { login, register } from "./util/auth";
import "./style.css";

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			passconfirm: "",
			email: "",
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
		const { isLogin } = this.state;

		isLogin
			? login(this.state)
					.then(this.responseHandler)
					.catch(this.validationHandler)
			: register(this.state)
					.then(this.responseHandler)
					.catch(this.validationHandler);

		console.log(this.state);
		this.setState({
			password: "",
			passconfirm: "",
			isLogin: true
		});
	};

	validationHandler = error => {
		console.log(error);
		// switch (error) {
			
		// }
	};

	responseHandler = response => {
		console.log(response);
		if (response.status === 200) {
			// window.location.assign("/user"); // not working as expected
		}
	};

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
