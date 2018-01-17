const Fs = require("fs");
const Path = require("path");

const controllers = new Array();

Fs.readdirSync(__dirname)
	.filter(file => {
		return (
			file.indexOf(".") !== 0 &&
			file !== Path.basename(__filename) &&
			file.slice(-3) === ".js"
		);
	})
	.forEach(file => {
		controllers.push(require(Path.join(__dirname, file))());
	});

module.exports = controllers;