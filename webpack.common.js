const fs = require('node:fs')
const path = require('node:path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const pages = require('./build/pages.cjs')
const SeoPlugin = require('./build/seo.cjs')
const cards = require('./src/data/tarotCards.json')

const pageEntries = { ...pages }
for (const card of cards)
  pageEntries[`cards/${card.htmlname}.html`] = ['cardTelling', 'menu']

module.exports = {
  context: __dirname,
  entry: {
    index: './src/index.jsx',
    menu: './src/menubar.jsx',
    about: './src/about.js',
    articles: './src/articles.js',
    search: './src/search.jsx',
    cards: './src/cards.jsx',
    cardoftheday: './src/cardoftheday.jsx',
    cardTelling: './src/cards/cardTelling.jsx',
    reading: './src/fortunetellings/reading.jsx',
    fortuneTellings: './src/fortuneTellings.jsx',
    fortunetelling: './src/fortunetelling.js',
    mouseeventcard: './src/cardonmouseevent.js',
    styleguide: './src/styleguide.js',
    page: './src/page.jsx'
  },
  output: {
    filename: 'assets/[name].[contenthash:8].js',
    path: path.resolve(__dirname, 'docs'),
    publicPath: '/',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }]
            ]
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 2 } },
          {
            loader: 'postcss-loader',
            options: { postcssOptions: { plugins: ['postcss-preset-env'] } }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          preprocessor(content, loaderContext) {
            return content.replace(
              /<(analytics|menu|footer)><\/\1>/g,
              (_, name) => {
                const file = path.resolve(
                  __dirname,
                  `src/partials/${name}.html`
                )
                loaderContext.addDependency(file)
                return fs.readFileSync(file, 'utf8')
              }
            )
          }
        }
      },
      { resourceQuery: /raw/, type: 'asset/source' },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: 'asset/resource',
        generator: { filename: 'images/[contenthash:16][ext]' }
      },
      {
        test: /\.(ttf|otf|woff2?)$/i,
        type: 'asset/resource',
        generator: { filename: 'fonts/[name].[contenthash:8][ext]' }
      }
    ]
  },
  plugins: [
    new SeoPlugin(),
    new MiniCssExtractPlugin({ filename: 'assets/[name].[contenthash:8].css' }),
    new CopyPlugin({
      patterns: [
        { from: 'src/share', to: 'share' },
        { from: 'public', to: '.' }
      ]
    }),
    ...Object.entries(pageEntries).map(
      ([filename, chunks]) =>
        new HtmlWebpackPlugin({
          filename,
          template: `./src/${filename}`,
          chunks,
          scriptLoading: 'defer'
        })
    )
  ]
}
