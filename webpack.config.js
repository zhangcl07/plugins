var webpack = require('webpack'),
    path = require('path');
module.exports = {
  devtool: 'debug',
  entry: './script/drag.js',
    output: {
        path: path.join(__dirname, './script'),
        filename: 'drag.bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['env']
                },
                exclude: /(node_modules)/
            }
        ]
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // })
    ]
}