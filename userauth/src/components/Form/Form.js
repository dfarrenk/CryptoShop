import React, { Component } from "react";
import "./style.css";

class Form extends Component {
	renderFields(args, reset) {
		const fields = args.map((elem, index) => {
			return (
				<div key={index} className="form-group">
					<label htmlFor={elem.name}>{elem.label}</label>
					<input
						type={elem.type}
						onChange={this.props.input}
						name={elem.name}
						id={elem.name}
						placeholder={elem.err || elem.val}
						className={`form-control ${elem.err && "err"}`}
						value={this.props.states[elem.name]}
					/>
				</div>
			);
		});
		return fields;
	}

	render() {
		const { className, fields, name, optional, footer, submit } = this.props;

		return (
			<form onSubmit={submit} className={className || ""}>
				{this.renderFields(fields)}
				{optional ? <div className="form-group">{optional}</div> : null}
				<input key="submit" type="submit" value={name} />
				{footer}
			</form>
		);
	}
}

export default Form;