import React from "react";

const Header = () =>{
	return (
		<div>
		<img src="#" alt="logo"/>
		<h1>
		Header
		</h1>
		<h2>Login</h2>
		<form action="/action_page.php">
		First name: <input type="text" name="fname"/><br/>
		Last name: <input type="text" name="lname"/><br/>
		</form>
		<h2>Xchange rates!</h2>
		</div>
		)
}

export default Header;