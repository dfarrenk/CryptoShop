import React from "react";
import ReactDom from "react-dom";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import SideBar from "./Components/SideBar";
import Body from "./Components/Body";
import "./app.css"

class App extends React.Component {
	render() {
		return <div className="app">
		<Header></Header>		
		<Body></Body>
		<SideBar></SideBar>
		<Footer></Footer>
		</div>;
	}
}
export default App;