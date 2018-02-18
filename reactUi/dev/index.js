import React from "react";
import ReactDom from "react-dom";
import Header from "./Components/Header";

class HelloMessage extends React.Component {
	render() {
		return <div>Hello !</div>;
	}
}

ReactDom.render(<div>
	<Header></Header>
	<HelloMessage />
	</div>,
	document.getElementById("appContainer")
	)