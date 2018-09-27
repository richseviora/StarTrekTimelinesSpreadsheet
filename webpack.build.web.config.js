const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackCdnPlugin = require('webpack-cdn-plugin');
const baseConfig = require('./webpack.base.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PACKAGE = require('./package.json');

// Config directories
const SRC_DIR = path.resolve(__dirname, 'src');
const SHARED_DIR = path.resolve(__dirname, 'shared');

// Any directories you will be adding code/files into, need to be added to this array so webpack will pick them up
const defaultInclude = [SRC_DIR, SHARED_DIR];

module.exports = merge(baseConfig, {
	output: {
		publicPath: './'
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader"
				]
			},
			{
				test: /\.(jpe?g|png|gif)$/,
				use: [{ loader: 'file-loader?name=img/[name]__[hash:base64:5].[ext]' }],
				include: defaultInclude
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				use: [{ loader: 'file-loader?name=font/[name]__[hash:base64:5].[ext]' }],
				include: defaultInclude
			},
			{
				test: /\.jsx?$/,
				use: [{ loader: 'babel-loader' }, { loader: 'webpack-preprocessor-loader', options: { params: { ENV: 'web' } } }],
				include: defaultInclude
			},
			{
				test: /\.tsx?$/,
				use: [{ loader: 'babel-loader' }, { loader: 'ts-loader' }, { loader: 'webpack-preprocessor-loader', options: { params: { ENV: 'web' } } }],
				include: defaultInclude
			}
		]
	},
	target: 'web',
	plugins: [
		new HtmlWebpackPlugin({
			title: `Star Trek Timelines Crew Management v${PACKAGE.version}-web BETA build ${new Date().toISOString()}`,
			favicon: 'src/assets/icons/ATFleet.ico'
		}),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: "[name].css",
			chunkFilename: "[id].css"
		}),
		new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),
		new WebpackCdnPlugin({
			modules: [
				{
					name: 'vis',
					var: 'vis'
				},
				{
					name: 'xlsx-populate',
					var: 'XlsxPopulate',
					path: 'browser/xlsx-populate.js'
				}
			],
			publicPath: '/node_modules'
		})
	],
	node: {
		fs: "empty"
	},
	stats: {
		colors: true,
		children: false,
		chunks: false,
		modules: false
	}
});
