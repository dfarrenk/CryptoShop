import React from "react";
import Form from "../Form";
import { default as Auth } from "../Authentication";
import { update } from "../../util/auth";
import fields from "./authconfig.json";
import "./style.css";

class Emailupdate extends Auth {
	constructor(props) {
		super(props);
		this.state = {
			email: "",
			originalpass: "",
			password: "",
			passconfirm: "",
			isEmail: true,
			fields: fields,
		};
	}

	submitHandler = evt => {
		evt.preventDefault();
		const { fields } = this.state;

		for (let elem in fields) {
			delete fields[elem].err;
		}

		update(this.state)
			.then(res => {
				const { status, data } = res;
				if (status === 204 || status === 304) {
					console.log(res);
					throw res;
					}
				this.responseHandler("reload", data.reload);
				})
			.catch(err => this.validationHandler(err, fields));

		console.log(this.state);
		this.setState({
			originalpass: "",
			password: "",
			passconfirm: ""
		});
	}

	clearFields = (resetname, value) => {
		for (let elem in fields) {
			delete fields[elem].err;
		}

		this.setflag();
		this.setState({
			email: "",
			originalpass: "",
			password: "",
			passconfirm: "",
			[resetname]: value
		}); 
	}

	// isEmail --> flag --> !isEmail
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
		const { isEmail, fields } = this.state;
		const { email, originalpass, password, passconfirm } = fields;
		return isEmail ? [ email, originalpass ] : [ originalpass, password, passconfirm ];
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

export default Emailupdate;