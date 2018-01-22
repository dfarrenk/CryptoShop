const infoRoute = require("express").Router();
const Users = require("../models").User;
const { authUser: memoryStore } = require("../config/config");

module.exports = function() {

	infoRoute.post("/forgotPass", function(req, res) {
		
		// send email
		


	});

	// put
	infoRoute.get("/user/verification", function(req, res) {
		console.log(req.query["t"]);
		res.status(200).send("awesome");
	});










	return infoRoute;
}