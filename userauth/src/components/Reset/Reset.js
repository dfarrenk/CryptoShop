import React, { Component } from "react";
import Form from "../Form";
import ErrorHandler from "../../util/errorhandler";
import { reset } from "../../util/auth";
import fields from "./authconfig.json";
import "./style.css";

class Reset extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			passconfirm: "",
			fields: fields
		};
	}

	inputHandler = evt => {
		const { name, value } = evt.target;
		this.setState({ [name]: value });
	}

	submitHandler = evt => {
		evt.preventDefault();
		const { fields } = this.state;

		for (let elem in fields) {
			delete fields[elem].err;
		}

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
				console.log(errType);
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

	responseHandler = response => {
		window.location.assign("/");
	}

	clearFields = (resetname, value) => {
		for (let elem in fields) {
			delete fields[elem].err;
		}

		this.setState({
			email: "",
			password: "",
			passconfirm: ""
		});
	}

	renderBody() {
		const { username, password, passconfirm } = fields;
		return [username, password, passconfirm];
	}

	render() {
		return (
			<Form
				key="content"
				fields={this.renderBody()}
				submit={this.submitHandler}
				input={this.inputHandler}
				name={"Submit"}
				states={this.state}
			/>
		);
	}
}

export default Reset;