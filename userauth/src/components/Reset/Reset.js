import React from "react";
import Form from "../Form";
import { default as Auth } from "../Authentication";
import { reset } from "../../util/auth";
import fields from "./authconfig.json";
import "./style.css";

class Reset extends Auth {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			passconfirm: "",
			fields: fields
		};
	}

	submitHandler = evt => {
		evt.preventDefault();
		const { fields } = this.state;

		for (let elem in fields) {
			delete fields[elem].err;
		}

		reset(this.state)
			.then(res => {
				const { status, data } = res;
				if (status === 204 || status === 304) {
					console.log(res);
					throw res;
				}
				this.responseHandler("assign", data.redirect);
			})
			.catch(err => this.validationHandler(err, fields));

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