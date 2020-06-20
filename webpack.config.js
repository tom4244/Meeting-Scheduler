var webpack = require("webpack");
var path = require("path");
// var SyntaxDynamicImportPlugin = require('babel-plugin-syntax-dynamic-import');
var DIST_DIR = path.resolve(__dirname, "server");
var SRC_DIR = path.resolve(__dirname, "src");

// const {CleanWebpackPlugin} = require('clean-webpack-plugin');
/*
						options: {
							limit: 100000,
							name: '[name].[ext]',
							outputPath: 'img/userPhotos/'
						}
*/
module.exports = {
	mode: 'development',
	devtool: 'cheap-module-source-map', 
	/* devtool: eval, */
  entry: [
		// 'babel-polyfill',
		'react-hot-loader/patch',
		'webpack-hot-middleware/client', 
		'@squadette/react-hammerjs/dist/react-hammerjs',
	  /* SRC_DIR + '/app/index.js' */
	  path.join(__dirname, 'src/app/index.js') 
  ],
	output: {
		path: path.join(__dirname, 'server'),
		filename: "bundle.js",
		publicPath: "/"
	},
	/* devServer: {
     contentBase: path.join(__dirname, "dist")
	 }, */
	plugins: [
		// new CleanWebpackPlugin(['app']),
		// new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin()
	],
	module: {
		rules: [
		// loaders: [
			{
				test: /\.jsx?$/,
				loader: 'babel-loader' , 
				exclude: /(node_modules)/,
				include: [
			    path.join(__dirname, 'src/app'),		
					SRC_DIR + 'server/shared'
				]
			},
			{
				test: /\.jsx?$/,
				use: 'react-hot-loader/webpack', 
				include: /(node_modules)/
			},
			{
				test: /\.(jpg|png)$/,
				use: {
						loader: 'url-loader',
				}
			},
			{
					test: /\.scss$/,
					loaders: ['style-loader', 'css-loader', 'sass-loader']
			},
      {
				test: /\.css$/,
				include: [
			    path.join(__dirname)		
				],
				loaders: ['style-loader', 'css-loader']
			}
		]
 	},
	node: {
		fs: 'empty'
	}
};

/* module.exports = config; */

