import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import Auth from "./AuthModal";
// import Emailupdate from "./components/UserUpdate";
import registerServiceWorker from "./registerServiceWorker";

if (window.location.pathname.match(/\/(?:login|register)+$/)) {
	ReactDOM.render(<Auth switch="user_auth"/>, document.getElementById("root"));
} else if (window.location.pathname.match(/\/(?:update)+$/)) {
	ReactDOM.render(<Auth switch="info_auth"/>, document.getElementById("root"));
} else {
	ReactDOM.render(<App />, document.getElementById("root"));
}
registerServiceWorker();