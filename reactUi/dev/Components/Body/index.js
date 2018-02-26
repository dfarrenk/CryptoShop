import React from "react";
import StoreItem from "../StoreItem";
import { Button } from 'react-bootstrap';

let array = [];
const populate = ()=>{
	
	for(let i=0;i<10;i++){
		array.push(<StoreItem className="flex-item" img="https://dummyimage.com/600x400/000/00ffd5.png"></StoreItem>)
	}
}


const Body = () =>{
	populate()
	return (
		<div > 
		<h1>Hello user!</h1> 
		<Button bsStyle="primary" bsSize="large">
		Large button  
		</Button>		
		<Button bsSize="large">
		Large button</Button> 
		<div className="flex-container row">
		{array}
		<StoreItem className="flex-item" img="https://dummyimage.com/600x400/000/00ffd5.png"></StoreItem>
		</div>
		</div>
		)
}

export default Body;