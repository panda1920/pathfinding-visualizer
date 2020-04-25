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
        extensions: [ '.ts' ]
    },
    module: {
        rules: [
            {
                test: /\.ts$/, 
                loader: 'ts-loader' 
            }
        ]
    }
};
