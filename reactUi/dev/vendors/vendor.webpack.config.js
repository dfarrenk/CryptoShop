var webpack = require('webpack');
var path = require("path");
module.exports = {
 entry: {
  vendor: [path.join(__dirname, "app", "vendors.js")]
},
output: {
 filename: '[name].bundle.js',
 path: __dirname + '/dist',
 library: '[name]_lib'
},

plugins: [
new webpack.DllPlugin({
 path: __dirname +'/dist/[name]-manifest.json',
 name: '[name]_lib'
})
]
};