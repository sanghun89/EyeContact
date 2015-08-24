import webpack, { DefinePlugin, BannerPlugin } from 'webpack';
import merge from 'lodash/object/merge';
import minimist from 'minimist';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const argv = minimist(process.argv.slice(2));
const DEBUG = !argv.release;

const GLOBALS = {
    'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
    '__DEV__': DEBUG
};

const autoprefix = '{browsers:["Android 2.3", "Android >= 4", "Chrome >= 20", "Firefox >= 24", "Explorer >= 8", "iOS >= 6", "Opera >= 12", "Safari >= 6"]}';
const lessLoaders = ['css-loader', `autoprefixer-loader?${autoprefix}`, 'less-loader'];

//
// Common configuration chunk to be used for both
// client-side (express.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------
const config = {
    output: {
        publicPath: './',
        sourcePrefix: '  '
    },
    cache: DEBUG,
    debug: DEBUG,
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin()
    ],
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
    },
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            }
        ],
        loaders : [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    }
};


//
// Configuration for the client-side bundle (express.js)
// -----------------------------------------------------------------------------
const appConfig = merge({}, config, {
    entry: './src/app.js',
    output: {
        path: './build/public',
        filename: 'app.js'
    },
    devtool: DEBUG ? 'source-map' : false,
    plugins: config.plugins.concat([
            new DefinePlugin(merge(GLOBALS, {'__SERVER__': false})),
            new ExtractTextPlugin("[name].css")
        ].concat(DEBUG ? [] : [
            new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"'}),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin(),
            new webpack.optimize.AggressiveMergingPlugin()
        ])
    ),
    module : {
        preLoaders: config.module.preLoaders,
        loaders : config.module.loaders.concat([
            {
                test: /\.less$/, loader: ExtractTextPlugin.extract('style-loader', lessLoaders.join('!'))
            }
        ])
    }
});




//
// Configuration for the server-side bundle (server.js)
// -----------------------------------------------------------------------------
const serverConfig = merge({}, config, {
    entry: './src/server.js',
    output: {
        path: './build',
        filename: 'server.js',
        libraryTarget: 'commonjs2'
    },
    target: 'node',
    externals: /^[a-z][a-z\.\-0-9]*$/,
    node: {
        console: false,
        global: false,
        process: false,
        Buffer: false,
        __filename: false,
        __dirname: false
    },
    devtool: DEBUG ? 'source-map' : 'cheap-module-source-map',
    plugins: config.plugins.concat(
        new DefinePlugin(merge(GLOBALS, {'__SERVER__': true})),
        new BannerPlugin('require("source-map-support").install();',
            { raw: true, entryOnly: false })
    )
});

export default [appConfig, serverConfig];
