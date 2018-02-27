import React from "react";
import "./style.css"
import InputForm from "../InputForm";

const Header = () =>{
return (
<div className="header">
	<img className="myLogo" src="https://thecryptoshop.herokuapp.com/assets/images/cryptoLogo-transWhite.png" alt="logo"/>
	<InputForm label="azazaa" ></InputForm>		
	<h2>Xchange rates!</h2>
</div>
)
}

export default Header;