import * as webpack from "webpack";

export const externals: webpack.ExternalsElement | webpack.ExternalsElement[] = {
  electron: 'require("electron")',
  net: 'require("net")',
  remote: 'require("remote")',
  shell: 'require("shell")',
  app: 'require("app")',
  ipc: 'require("ipc")',
  fs: 'require("fs")',
  buffer: 'require("buffer")',
  system: "{}",
  file: "{}",
};

export const alias: { [key: string]: string } = {};

export const nodepPolyfill: webpack.Node | false = {
  module: "empty",
  dgram: "empty",
  dns: "mock",
  fs: "empty",
  net: "empty",
  tls: "empty",
  child_process: "empty",
};
