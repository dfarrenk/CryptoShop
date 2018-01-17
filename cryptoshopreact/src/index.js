import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import Auth from "./Auth";
import registerServiceWorker from "./registerServiceWorker";


if (window.location.pathname.match(/\/(?:login|user)+$/)) {
	ReactDOM.render(<Auth />, document.getElementById("root"));
	registerServiceWorker();
} else {
	ReactDOM.render(<App />, document.getElementById("root"));
	registerServiceWorker();
}
