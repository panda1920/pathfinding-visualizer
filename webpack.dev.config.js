const path = require('path');
const merge = require('webpack-merge');

const common = require('./webpack.config.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/index.bundle.js'
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                // inject styles into DOM using javascript
                test: /\.scss$/,
                use: [
                    {
                        // inject css into DOM
                        loader: 'style-loader'
                    },
                    {
                        // convert css into javascript and embed into code
                        loader: 'css-loader'
                    },
                    {
                        // convert sass to css
                        loader: 'sass-loader'
                    }
                ]
            }
        ]
    }
});
