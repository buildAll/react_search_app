// basic varibles
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// for compile different files for specific usage
const merge = require('webpack-merge');
const TARGET = process.env.npm_lifecycle_event;

// config in package.json
const pkg = require('./package.json');

// 3rd party plugins
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');


// postcss
const autoprefixer = require('autoprefixer');
const precss = require('precss');
const postcssImport = require('postcss-import');

// project path config
const PATHS = {
    app: path.join(__dirname, 'src/js/main.js'),
    build: path.join(__dirname, 'dist/scripts'),
    images: path.join(__dirname, 'dist/images')
};

// common config for webpack
const common = {
    entry: {
        app: PATHS.app
    },
    output: {
        path: PATHS.build,
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test:/\.js$/,
                exclude: path.resolve(__dirname, "node_modules"),
                loader:'babel',
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    }
}

// config for the development phase
if (TARGET === 'start' || !TARGET) {
    module.exports = merge(common, {
        devtool: 'eval-source-map',
        devServer: {
            historyApiFailback: true,
            hot: true,
            inline: true,
            progress: true,
            stats: 'errors-only',
            host: process.env.HOST,
            port: process.env.PORT
        },
        module: {
            loaders: [
                {
                    test: /\.css$/,
                    loaders: ['style', 'css', 'postcss']
                },
                {
                    test: /\.jpg|png|jpeg/,
                    loader: 'url?limit=25000'
                },
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'Search app',
                template: './index.tpl.html'
            }),
            new webpack.HotModuleReplacementPlugin()
        ],
        postcss: function(webpack) {
            return [
                postcssImport({addDependencyTo: webpack}),
                autoprefixer,
                precss
            ];
        }
    });
}

// config for the production phase
if (TARGET === 'build') {
    module.exports = merge(common, {
        entry: {
            vendor: ['jquery', 'swiper']
        },
        output: {
            path: PATHS.build,
            filename: '[name].[chunkhash].js',
            chunkFilename: '[chunkhash].js'
        },
        module: {
            loaders: [
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract('style', 'css!postcss'),
                },
                {
                    test: /\.(jpg|png|jpeg)$/,
                    loader: 'url?limit=25000'
                }
            ]
        },
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            }),
            new webpack.optimize.CommonsChunkPlugin({
                names: ['vendor', 'manifest']
            }),
            new ExtractTextPlugin('[name].[chunkhash].css'),
            new CleanWebpackPlugin([PATHS.build]),
            new HtmlWebpackPlugin({
                title: 'React Search app',
                template: './index.tpl.html',
                filename: path.join(__dirname, 'dist/index.html')
            })
        ],
        postcss: function() {
            return [
                postcssImport({addDependencyTo: webpack}),
                autoprefixer,
                precss
            ];
        }
    });
}


