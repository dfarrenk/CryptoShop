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
			test:/\.css$/,
			use:['style-loader','css-loader']
		},	{
			test: /\.js?/,
			loader: "babel-loader",
			exclude: [
			path.resolve(__dirname, "node_modules")
			],
			query:{
				cacheDirectory: true,
				presets: ['react']
			}
		}
		]
	},
	plugins: [
	new UglifyJsParallelPlugin({
            workers: os.cpus().length, // usually having as many workers as cpu cores gives good results
            // other uglify options
        }),
	new webpack.optimize.DedupePlugin()
	]
}