var webpack = require("webpack");
module.exports = {
	entry: './reactUI/index.js',
	output: {
		filename: './reactUI/bundle.js'
	},
	module: {
		loaders: [
		{
			test: /\.js?/,
			loader: "babel-loader",
			exclude: /node-modules/,
			quiery:{
				presets: ["env"]
			}
		}
		]
	}
}