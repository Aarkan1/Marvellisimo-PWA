const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
// const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
  entry: './src/main.js',
  devtool: 'source-map',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: true,
      template: path.resolve(__dirname, 'src', 'index.html'),
    }),
    // new CompressionPlugin({
    //   algorithm: 'gzip',
    // })
  ],
  optimization: {
    minimizer: [
        new TerserPlugin({
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        parallel: true,
        // Enable file caching
        cache: true,
        sourceMap: true,
      }),
    ],
  },
}