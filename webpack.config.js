const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    target: 'web',
    entry: './src/ts/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/index.[contentHash].bundle.js'
    },
    resolve: {
        // tell webpack where to look for modules imported in each file
        extensions: [ '.ts', '.mjs', '.js' ],
        modules: [ 'node_modules' ]
    },
    module: {
        rules: [
            {
                // typescript files go through tsc compilation -> babel transpile
                // exclude files in node_modules folder because they don't need to it
                test: /\.ts$/, 
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader'
                    },
                    {
                        loader: 'ts-loader'
                    }
                ]
            },
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
    },
    plugins: [
        // generates html from template
        new HtmlWebpackPlugin({
            title: 'Pathfinding-visualizer',
            filename: 'index.html',
            template: './src/template.html'
        })
    ]
};
