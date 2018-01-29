import React, { Component } from "react";
import Login from "./components/LoginOut";
import UserUpdate from "./components/UserUpdate";
import "./index.css";

class Auth extends Component {
	renderBody(swt) {
		switch(swt) {
			case "user_auth":
				return <Login />;
			case "info_auth":
				return <UserUpdate />;
			default: 
				console.log("errrrr");
		}	
	}

	render() {
		return (
			<main className="--center">
				{ this.renderBody(this.props.switch) }
			</main>
		);
	}
}

export default Auth;
