const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
   context: path.resolve(__dirname, 'src'),
   entry: './js/main.js',
   output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
   }, 
   mode: 'development',
   plugins: [
      new HtmlWebpackPlugin({
         template: './html/index.pug'
      }),
      new CleanWebpackPlugin()
   ],
   module: {
      rules: [
         {
            test: /\.s[ac]ss$/,
            use: [
               'style-loader',
               'css-loader',
               'sass-loader'
            ]
         },         
         {
            test: /\.pug$/,
            loader: 'pug-loader'
         },
         {
            test: /\.(png|jpe?g|gif|svg)$/i,
            use: [
               {
                  loader: 'file-loader',
                  options: {
                     name: '[name].[ext]',
                  },
               },
            ],
         },
      ]
   }
}
