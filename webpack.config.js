var webpack = require("webpack");
module.exports = {
	entry: './reactUI/index.js',
	output: {
		filename: './reactUI/static/bundle.js'
	},
	module: {
		rules: [
		{
			test: /\.js?/,
			loader: "babel-loader",
			exclude: /node-modules/,
			query:{
				presets: ['es2015', 'react', 'stage-0', 'stage-1']
			}
		}
		]
	}
}