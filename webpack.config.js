const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    target: 'web',
    entry: './src/ts/index.ts',
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
