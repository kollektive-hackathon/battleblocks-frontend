const path = require('path')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Dotenv = require('dotenv-webpack')

// eslint-disable-next-line import/no-commonjs
module.exports = {
    entry: {
        index: path.join(__dirname, 'src/main.tsx')
    },
    devtool: 'source-map',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            ['@babel/preset-react', { runtime: 'automatic' }],
                            '@babel/preset-typescript'
                        ]
                    }
                }
            },
            {
                test: /\.(scss)$/i,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        fallback: {
            http: require.resolve('stream-http')
        },
        plugins: [
            new TsconfigPathsPlugin({
                extensions: ['.ts', '.tsx', '.js', '.json']
            })
        ]
    },
    devServer: {
        port: 3000,
        host: 'localhost',
        hot: true,
        historyApiFallback: true
    },
    plugins: [new NodePolyfillPlugin(), new HtmlWebpackPlugin({ template: 'index.html' }), new Dotenv()]
}
