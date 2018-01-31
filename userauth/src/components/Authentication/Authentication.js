import React, { Component } from "react";
import ErrorHandler from "../../util/errorhandler";
import "./style.css";

class Authenticator extends Component {
	inputHandler = evt => {
		const { name, value } = evt.target;
		this.setState({ [name]: value });
	}

	validationHandler = (error, fields) => {
		const errorhandler = new ErrorHandler();
		errorhandler
			.getError(error)
			.errorHandling()
			.then(errType => {
				let { field, message } = errType;
				
				if (!field) {
					this.props.result("error", message);
				} else {
					fields[field].err = message;
				}
				this.setState({
					[field]: "",
					fields: fields
				});
			});
	}

	responseHandler = (method = "assign", response = "/") => {
		window.location[method](response);
	}

	render()	{
		return <h1>Hello World</h1>;
	}
}

export default Authenticator;