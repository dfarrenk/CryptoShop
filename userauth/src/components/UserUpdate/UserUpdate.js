import React, { Component } from "react";
import Form from "../Form";
import ErrorHandler from "../../util/errorhandler";
import { update } from "../../util/auth";
import fields from "./authconfig.json";
import "./style.css";

class Emailupdate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: "",
			originalpass: "",
			password: "",
			passconfirm: "",
			fields: fields,
		};
	}

	inputHandler = evt => {
		const { name, value } = evt.target;
		this.setState({ [name]: value });
	};

	submitHandler = evt => {
		evt.preventDefault();
		const { fields } = this.state;

		for (let elem in fields) {
			delete fields[elem].err;
		}

		update(this.state)
			.then(res => {
				const { status } = res;
				if (status === 204 || status === 304) {
					console.log(res);
					throw res;
					}
				this.responseHandler(res);
				})
			.catch(err => this.validationHandler(err, fields));

		console.log(this.state);
		this.setState({
			originalpass: "",
			password: "",
			passconfirm: ""
		});
	};

	validationHandler = (error, fields) => {
		const errorhandler = new ErrorHandler();
		errorhandler
			.getError(error)
			.errorHandling()
			.then(errType => {
				let { field, message } = errType;

				if (!field) {
					// this is where we decided what to do with server error
					// fields.username.err = message;
					// field = "username";
					// call error object 
				} else {
					fields[field].err = message;
				}
				this.setState({
					[field]: "",
					fields: fields
				});
			});
	};

	responseHandler = response => {
		console.log(response);
		if (response.status < 300) {
			window.location.reload(); // true?
		}
	}

	renderBody() {
		const { email, originalpass, password, passconfirm } = this.state.fields;
		return [ email, password, passconfirm ];
	}

	render() {
		const { isLogin, resetPass } = this.state;
		let footer = "fff" /*this.renFooter();*/

		if (resetPass) {
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
				name={"Confirm"}
				footer={"footer"}
				states={this.state}
			/>
		);
	}
}

export default Emailupdate;