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
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Search app',
            template: './index.html'
        }),

    ]
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
                    loaders: ['style', 'css']
                },
                {
                    test: /\.jpg|png|jpeg/,
                    loader: 'url?limit=25000'
                },
                {
                    test:/\.js$/,
                    exclude: path.resolve(__dirname, "node_modules"),
                    loader:'babel',
                    query: {
                        presets: ['es2015', 'react']
                    }
                }
            ]
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ],
       // postcss: function() {
       //     return [autoprefixer, precss];
       // }
    });
}

// config for the production phase
if (TARGET === 'build') {
    module.exports = merge(common, {
        entry: {
            vendor: Object.keys(pkg.dependencies)
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
                    loader: 'url?limit=25000',
                    include: PATHS.images
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
            new CleanWebpackPlugin([PATHS.build])
        ],
        postcss: function() {
            return [autoprefixer, precss];
        }
    });
}


