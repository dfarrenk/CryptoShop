import React, { Component } from "react";
import "./style.css";

const Err = props => {
	return (
		<div className="card text-white bg-danger mb-3">
			<div className="card-body">{props.response}</div>
		</div>
	);
};

export default Err;
