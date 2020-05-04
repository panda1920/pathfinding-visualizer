const path = require('path');
const common = require('./webpack.config.js');
const merge = require('webpack-merge');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/index.bundle.js'
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist')
    }
});
