const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.mjs',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'env-setup.js',
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.mjs'],
    },
    target: 'node',
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'packageData.json', to: 'packageData.json' },
                { from: 'scripts/', to: 'scripts/' },
            ],
        }),
    ],
};
