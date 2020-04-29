const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    target: 'web',
    entry: './src/ts/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: 'index.bundle.js'
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
                // exclude files in node_modules folder for such procedure
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
            }
        ]
    }
};
