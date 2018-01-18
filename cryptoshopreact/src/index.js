import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import Auth from "./Auth";
import registerServiceWorker from "./registerServiceWorker";

if (window.location.pathname.match(/\/(?:login|register)+$/)) {
	ReactDOM.render(<Auth />, document.getElementById("root"));
	registerServiceWorker();
} else if (window.location.pathname.match(/\/(?:user)+$/)) {
} else {
	ReactDOM.render(<App />, document.getElementById("root"));
	registerServiceWorker();
}
