import React from "react";
import "./style.css"

const Item = (props)=>{
	return(
		<div className={props.className+ " item"}>
		<img src={props.img} alt=""/>
		<h1>I'm an item!</h1>
		</div>
		)
}

export default Item;