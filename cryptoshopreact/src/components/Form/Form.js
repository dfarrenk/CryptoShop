import React, { Component } from "react";
import "./style.css";

class Form extends Component {
	constructor(props) {
		super(props);
		this.state = this.props.states;
	}

	inputHandler = evt => {
		const { name, value } = evt.target;
		this.setState({ [name]: value });
	};

	renderFields(args) {
		const fields = args.map((elem, index) => {
			return (
				<div key={index} className="form-group">
					<label htmlFor={elem.name}>{elem.label}</label>
					<input
						type={elem.type}
						onChange={this.inputHandler}
						name={elem.name}
						id={elem.name}
						placeholder={elem.err || elem.val}
						className={`form-control ${elem.err && "err"}`}
						value={this.state[elem.name]}
					/>
				</div>
			);
		});

		return fields;
	}

	render() {
		const { submitHandler: submit, className, fields } = this.props;
		return (
			<form onSubmit={submit} className={className || ""}>
				{ this.renderFields(fields) }
			</form>
		)
	}
}

export default Form;