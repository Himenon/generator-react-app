import * as MiniCssExtractPlugin from "mini-css-extract-plugin";
import * as webpack from "webpack";
import { paths } from "../../config/paths";

export const rules: { [key: string]: webpack.Rule } = {
  sourceMapLoader: {
    test: /\.(js|jsx|mjs)$/,
    loader: "source-map-loader",
    enforce: "pre",
    include: paths.appSrc,
  },
  cacheLoader: {
    loader: "cache-loader",
  },
  tsLoader: {
    test: /\.tsx?$/,
    use: [
      {
        loader: "ts-loader",
        options: {
          transpileOnly: true,
          experimentalWatchApi: true,
        },
      },
    ],
  },
  htmlLoader: {
    test: /\.html$/,
    loader: "html-loader",
  },
  urlLoader: {
    test: /\.(jpe?g|png|eot|svg|gif|woff2?|ttf)$/,
    use: [
      {
        // file-loader, mime, url-loaderが必要
        loader: "url-loader",
        options: {
          limit: 10000,
          name: "assets/[name].[ext]?[hash]",
        },
      },
    ],
  },
  fileLoader: {
    test: /\.(jpe?g|png|eot|svg|gif|woff2?|ttf)$/,
    use: [
      {
        loader: "file-loader",
        options: {
          name: "assets/[name].[ext]",
        },
      },
    ],
  },
  styleLoader: {
    test: /\.(scss|css)$/,
    exclude: /node_modules/,
    use: [
      // linkタグを出力
      process.env.NODE_ENV !== "production" ? "style-loader" : MiniCssExtractPlugin.loader,
      // 'style-loader',
      // MiniCssExtractPluginがcss-loaderのmodulesを殺してしまう
      // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/10
      // {
      //     loader: MiniCssExtractPlugin.loader,
      //     options: {
      //         // you can specify a publicPath here
      //         // by default it use publicPath in webpackOptions.output
      //         publicPath: '../'
      //     }
      // },
      {
        loader: "css-loader",
        options: {
          modules: true,
          camelCase: true,
          importLoaders: 3,
          localIdentName: "___[local]___[hash:base64:5]",
        },
      },
      "resolve-url-loader",
      {
        loader: "postcss-loader",
        options: {
          // PostCSS側でもソースマップを有効にする
          sourceMap: true,
          plugins: [
            // Autoprefixerを有効化
            // ベンダープレフィックスを自動付与する
            require("autoprefixer")({
              grid: true,
            }),
          ],
        },
      },
      "sass-loader",
    ],
  },
};
