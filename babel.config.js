// referred to article below to construct this config file:
// https://www.wisdomgeek.com/development/web-development/how-to-setup-jest-typescript-babel-webpack-project/
module.exports = api => {
    // becomes true when running jest
    const isTest = api.env('test');
    api.cache(true);

    return {
        presets: [
            ['@babel/preset-env', {
               targets: "defaults", modules: isTest ? 'commonjs' : false
            }]
        ]
    };
};
