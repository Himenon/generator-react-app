import * as path from "path";
import * as webpack from "webpack";
import { getClientEnvironment } from "../../config/env";
import { moduleFileExtensions, paths } from "../../config/paths";
import * as commonConfig from "./common";
import { minimizerPluginMap } from "./optimization";
import { plugins } from "./plugins";
import { rules as defaultRules } from "./rules";

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";
const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== "false";

export const configFactory = (webpackEnv: "development" | "production"): webpack.Configuration => {
  const isEnvDevelopment = webpackEnv === "development";
  const isEnvProduction = webpackEnv === "production";

  const publicPath = isEnvProduction ? paths.servedPath : isEnvDevelopment && "/";
  const publicUrl = isEnvProduction && publicPath ? publicPath.slice(0, -1) : isEnvDevelopment && "";
  const env = getClientEnvironment(publicUrl);

  return {
    mode: isEnvProduction ? "production" : "development",
    bail: isEnvProduction,
    stats: "errors-only",
    entry: {
      index: paths.appIndexJs,
    },
    target: "electron-renderer",
    devtool: "cheap-module-source-map",
    output: {
      path: isEnvProduction ? paths.appBuild : undefined,
      publicPath: isEnvProduction ? paths.servedPath : isEnvDevelopment ? "/" : undefined,
      chunkFilename: isEnvProduction
        ? "static/js/[name].[chunkhash:8].chunk.js"
        : isEnvDevelopment
        ? "static/js/[name].chunk.js"
        : undefined,
      filename: isEnvProduction ? "static/js/[name].[chunkhash:8].js" : isEnvDevelopment ? "static/js/bundle.js" : undefined,
      pathinfo: isEnvDevelopment,
      devtoolModuleFilenameTemplate: isEnvProduction
        ? info => path.relative(paths.appSrc, info.absoluteResourcePath).replace(/\\/g, "/")
        : isEnvDevelopment
        ? info => path.resolve(info.absoluteResourcePath).replace(/\\/g, "/")
        : undefined,
    },
    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        minimizerPluginMap.terser({ shouldUseSourceMap }),
        // This is only used in production mode
        minimizerPluginMap.optimizeCssAssetsPlugin({ shouldUseSourceMap }),
      ],
      // Automatically split vendor and commons
      // https://twitter.com/wSokra/status/969633336732905474
      // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
      splitChunks: {
        chunks: "all",
        name: false,
      },
      // Keep the runtime chunk separated to enable long term caching
      // https://twitter.com/wSokra/status/969679223278505985
      runtimeChunk: true,
    },
    module: {
      rules: [
        defaultRules.cacheLoader,
        defaultRules.sourceMapLoader,
        defaultRules.tsLoader,
        defaultRules.htmlLoader,
        defaultRules.urlLoader,
        defaultRules.styleLoader,
      ],
    },
    plugins: [
      plugins.ForkTsCheckerWebpackPlugin(),
      plugins.HtmlWebpackPlugin({ isEnvProduction }),
      isEnvProduction && shouldInlineRuntimeChunk && plugins.InlineChunkHtmlPlugin,
      plugins.InterpolateHtmlPlugin(env),
      // plugins.ModuleNotFoundPlugin(paths),
      plugins.DefinePlugin(env),
      plugins.MiniCssExtractPlugin(),
    ].filter(Boolean),
    resolve: {
      extensions: moduleFileExtensions,
      alias: commonConfig.alias,
    },
    node: commonConfig.nodepPolyfill,
  };
};
