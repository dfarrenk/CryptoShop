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
        }
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
                console.log(errType)
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
		console.log(response);
		if (response.status < 300 && response.status > 100) {
			window.location.reload(true); // true?
		}
	}

	clearFields = (resetname, value) => {
		for (let elem in fields) {
			delete fields[elem].err;
		}

		this.setflag();
		this.setState({
			email: "",
			password: "",
			passconfirm: "",
			[resetname]: value
		});
	}

	setflag () {
		return this.state.isEmail ? this.props.flag("info", "password") : this.props.flag("info", "email");
	}

	renFooter() {
		const { isEmail } = this.state;
		const msg = isEmail ? "Change Password?" : "Change Email?";
		return (
			<p key="footer" className="--anchor float-right">
				<a key="userchoice" onClick={() => this.clearFields("isEmail", !isEmail)}>
					{msg}
				</a>
			</p>
		);
	}

	renderBody() {
		const { username, password, passconfirm } = fields;
		return [ username, password, passconfirm ];
	}

	render() {
		return (
			<Form
				key="content"
				fields={this.renderBody()}
				submit={this.submitHandler}
				input={this.inputHandler}
				name={"Confirm"}
				footer={this.renFooter()}
				states={this.state}
			/>
		);
	}
}

export default Reset;