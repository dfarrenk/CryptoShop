import React from "react";
import { Button } from 'react-bootstrap';

const Body = () =>{
	return (
		<div className="container">
		<div className="row">
		<div className="col-sm-12">
		<h1>Hello user! </h1> 
		<Button bsStyle="primary" bsSize="large">
		Large button  
		</Button>
		<Button bsSize="large">Large button</Button> 
		</div>
		</div>
		</div>
		)
}

export default Body;