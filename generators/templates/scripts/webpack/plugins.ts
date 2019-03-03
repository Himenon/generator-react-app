import ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin-alt");
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as MiniCssExtractPlugin from "mini-css-extract-plugin";
import * as webpack from "webpack";
import * as ManifestPlugin from "webpack-manifest-plugin";
import { paths } from "../../config/paths";
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");
const InlineChunkHtmlPlugin = require("react-dev-utils/InlineChunkHtmlPlugin");
const ModuleNotFoundPlugin = require("react-dev-utils/ModuleNotFoundPlugin");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

export const plugins = {
  // new BundleAnalyzerPlugin(),
  // ts-loader | tslint を別プロセスで動かす
  ForkTsCheckerWebpackPlugin: (): webpack.Plugin =>
    new ForkTsCheckerWebpackPlugin({
      async: true,
      watch: paths.appSrc,
      tsconfig: paths.appTsConfig,
      tslint: paths.appTslint,
    }),
  // https://github.com/jantimon/html-webpack-plugin/issues/218
  HtmlWebpackPlugin: ({ isEnvProduction }: { isEnvProduction: boolean }): webpack.Plugin =>
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      ...(isEnvProduction
        ? {
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
          }
        : undefined),
    }),
  MiniCssExtractPlugin: (): webpack.Plugin =>
    new MiniCssExtractPlugin({
      filename: "stylesheets/[name].css",
    }),
  ModuleNotFoundPlugin: ({ appPath }: { appPath: string }) => new ModuleNotFoundPlugin(appPath),
  InlineChunkHtmlPlugin: () => new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime~.+[.]js/]),
  InterpolateHtmlPlugin: (env: { raw: any }) => new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
  DefinePlugin: (env: { stringified: any }) => new webpack.DefinePlugin(env.stringified),
  ManifestPlugin: ({ publicPath }: { publicPath: string }) =>
    new ManifestPlugin({
      fileName: "asset-manifest.json",
      publicPath,
    }),
};
