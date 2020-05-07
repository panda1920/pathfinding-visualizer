const path = require('path');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const common = require('./webpack.config.js');

module.exports = merge(common, {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/index.[contentHash].bundle.js'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'main.[contentHash].bundle.css'
        }),
        new CleanWebpackPlugin()
    ],
    module: {
        rules: [
            {
                // inject styles into DOM using javascript
                test: /\.scss$/,
                use: [
                    {
                        // creates a separate css file
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: true,
                        }
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
