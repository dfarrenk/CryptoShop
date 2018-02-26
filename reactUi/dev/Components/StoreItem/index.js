import React from "react";
import "./style.css"

const Item = (props)=>{
	return(
		<div className={props.className+ " item"}>
		<h1>I'm an item!</h1>
		</div>
		)
}

export default Item;