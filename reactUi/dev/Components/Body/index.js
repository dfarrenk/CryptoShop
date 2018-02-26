import React from "react";
import StoreItem from "../StoreItem";

import { Button } from 'react-bootstrap';

const Body = () =>{
	return (
		<div className="flex-container row"> 
		<h1>Hello user!</h1> 
		<Button bsStyle="primary" bsSize="large">
		Large button  
		</Button>
		<Button bsSize="large">Large button</Button> 
		<StoreItem className="flex-item"></StoreItem>
		<StoreItem className="flex-item"></StoreItem>
		<StoreItem className="flex-item"></StoreItem>
		<StoreItem className="flex-item"></StoreItem>
		<StoreItem className="flex-item"></StoreItem>
		<StoreItem className="flex-item"></StoreItem>
		<StoreItem className="flex-item"></StoreItem>
		<StoreItem className="flex-item"></StoreItem>
		<StoreItem className="flex-item"></StoreItem>
		</div>
		)
}

export default Body;