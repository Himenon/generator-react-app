import * as Generator from 'yeoman-generator'
import * as _s from "underscore.string";
import * as ReadPkgUp from "read-pkg-up";

interface PromptResult {
  projectName: string;
  description: string;
  repositoryName: string;
  authorName: string;
  authorEmail: string;
  authorUrl: string;
}

interface PromptQuestion extends Generator.Question {
  type?: "input" | "confirm" | "list" | "rawlist" | "password";
  name: keyof PromptResult;
}

export = class extends Generator {
  constructor(args: string|string[], options: {}) {
    super(args, options);
  }

  private _mv(from: string, to: string) {
    this.fs.move(this.destinationPath(from), this.destinationPath(to));
  }

  public async _prompting(): Promise<PromptResult> {
    const pkg: {[k: string]: any} | undefined = ReadPkgUp.sync({ normalize: false }).pkg;
    const questions: PromptQuestion[] = [
      {
        type: "input",
        name: "projectName",
        message: "Your project name",
        default: pkg && pkg.name || _s.slugify(this.appname), // Default to current folder name
      },
      {
        type: "input",
        name: "description",
        message: "Project description",
        default: pkg && pkg.description,
      },
      {
        type: "input",
        name: "repositoryName",
        message: "Repository name",
        default: pkg && pkg.repository,
      },
      {
        type: "input",
        name: "authorName",
        message: "Author name",
        default: pkg && pkg.author && pkg.author.name,
      },
      {
        type: "input",
        name: "authorEmail",
        message: "Author email",
        default: pkg && pkg.author && pkg.author.email,
      },
      {
        type: "input",
        name: "authorUrl",
        message: "Profile url",
        default: pkg && pkg.author && pkg.author.url,
      },
    ]
    return await this.prompt(questions) as PromptResult;
  }

  public async init() {
    const templateOptions = await this._prompting();
    this.fs.copyTpl(
      `${this.templatePath()}/**`,
      this.destinationPath(),
      templateOptions
    )
    const dotFiles = [
      "dependency-cruiser.json",
      "eslintrc.json",
      "gitignore",
      "huskyrc",
      "lintstagedrc",
      "npmrc",
      "npmrc.template",
      "prettierignore",
      "prettierrc",
      "travis.yml",
      "yarnrc",
    ]
    dotFiles.forEach(dotFile => this._mv(`_${dotFile}`, `.${dotFile}`));
    this._mv("_package.json", "package.json");
    this._mv("_README.md", "README.md");
    this._mv("_LICENSE", "LICENSE");
  }

  public install() {
    const dependencyPackages = [
      "react",
      "react-dom",
    ];
    const devDependencyPackages = [
      "@commitlint/cli",
      "@commitlint/config-conventional",
      "@types/fs-extra",
      "@types/html-webpack-plugin",
      "@types/jest",
      "@types/jsdom",
      "@types/mini-css-extract-plugin",
      "@types/node",
      "@types/optimize-css-assets-webpack-plugin",
      "@types/react",
      "@types/react-dev-utils",
      "@types/react-dom",
      "@types/terser-webpack-plugin",
      "@types/webpack",
      "@types/webpack-dev-server",
      "@types/webpack-manifest-plugin",
      "@typescript-eslint/eslint-plugin",
      "@typescript-eslint/eslint-plugin-tslint",
      "@typescript-eslint/parser",
      "autoprefixer",
      "babel-jest",
      "babel-loader",
      "babel-plugin-named-asset-import",
      "babel-preset-react-app",
      "bfj",
      "cache-loader",
      "case-sensitive-paths-webpack-plugin",
      "codecov",
      "css-loader",
      "dependency-cruiser",
      "eslint",
      "eslint-config-react-app",
      "eslint-loader",
      "eslint-plugin-flowtype",
      "eslint-plugin-import",
      "eslint-plugin-jsx-a11y",
      "eslint-plugin-react",
      "fibers",
      "file-loader",
      "fork-ts-checker-webpack-plugin-alt",
      "fs-extra",
      "generate-changelog",
      "html-loader",
      "html-webpack-plugin@4.0.0-alpha.2",
      "husky",
      "jest",
      "jest-cli",
      "jest-pnp-resolver",
      "jsdom",
      "lint-staged",
      "mini-css-extract-plugin",
      "optimize-css-assets-webpack-plugin",
      "pnp-webpack-plugin",
      "postcss-flexbugs-fixes",
      "postcss-loader",
      "postcss-preset-env",
      "postcss-safe-parser",
      "prettier",
      "react-dev-utils",
      "rimraf",
      "sass",
      "sass-loader",
      "serve",
      "sort-package-json",
      "style-loader",
      "terser-webpack-plugin",
      "ts-jest",
      "ts-loader",
      "ts-node",
      "tslint",
      "tslint-config-prettier",
      "tslint-config-standard",
      "tslint-plugin-prettier",
      "typescript",
      "url-loader",
      "webpack",
      "webpack-cli",
      "webpack-dev-server",
      "webpack-manifest-plugin",
      "workbox-webpack-plugin",
    ];
    this.yarnInstall(dependencyPackages, { dev: false })
    this.yarnInstall(devDependencyPackages, { dev: true })
  }

  public git() {
    this.spawnCommandSync("git", ["init"]);
  }
};
