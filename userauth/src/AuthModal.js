import React, { Component } from "react";
import Login from "./components/LoginOut";
import UserUpdate from "./components/UserUpdate";
import Reset from "./components/Reset";
import Err from "./components/Error";
import "./index.css";

// this is similar to original auth but designed to fit in modal
class Auth extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: {
				login: "Login with credential",
				register: "Register an account",
				forgot: "Forgot your password?"
			},
			info: {
				email: "Change your email",
				password: "Change your password"
			},
			reset: {
				password: "Reset password"
			},
			message: "",
			response: ""
		};
	}

	flagResponse = (flag, message) => {
		this.setState({ response: message });
	};

	flagState = (mode, name) => {
		const { [name]: value } = this.state[mode];
		this.setState({ message: value });
	};

	renderBody(swt) {
		switch (swt) {
			case "user_auth":
				return <Login flag={this.flagState} result={this.flagResponse} />;
			case "info_auth":
				return <UserUpdate flag={this.flagState} result={this.flagResponse} />;
			case "reset_auth":
				return <Reset result={this.flagResponse} />;
			default:
				console.log("Error: check switch prop");
		}
	}

	componentDidMount() {
		const { user, info, reset } = this.state;
		const mode = this.props.switch;
		switch(true) {
			case !!mode.match(/user/): 
				return this.setState({ message: user.login });
			case !!mode.match(/info/):
				return this.setState({ message: info.email });
			case !!mode.match(/reset/):
				return this.setState({ message: reset.password });
			default:
				console.log("Error: check if switch prop is given correctly.");
		}
	}

	render() {
		const { message, response } = this.state;

		return [
			<div key="modalheader" className="modal-header">
				<h5 className="modal-title">{message}</h5>
				<button
					type="button"
					className="close"
					data-dismiss="modal"
					aria-label="Close"
				>
					<span aria-hidden="true">&times;</span>
				</button>
			</div>,
			<div key="modalbody" className="modal-body">
				{this.renderBody(this.props.switch)}
			</div>,
			response ? (
				<div key="messagebody" className="modal-footer">
					<Err response={response} />
				</div>
			) : null
		];
	}
}

export default Auth;
