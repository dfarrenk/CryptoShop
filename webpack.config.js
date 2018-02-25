var webpack = require("webpack");
const os = require('os');
const UglifyJsParallelPlugin = require('webpack-uglify-parallel');
const path = require('path');
module.exports = {
	entry: './reactUI/dev/index.js',
	output: {
		filename: './reactUI/build/bundle.js'
	},
	module: {
		rules: [
		{
			test: /\.js?/,
			loader: "babel-loader",
			exclude: [
			path.resolve(__dirname, "app/demo-files")
			],
			query:{
				presets: ['es2015', 'react', 'stage-0', 'stage-1']
			}
		}
		]
	},
	plugins: [
	new UglifyJsParallelPlugin({
            workers: os.cpus().length, // usually having as many workers as cpu cores gives good results
            // other uglify options
        })
	]
}