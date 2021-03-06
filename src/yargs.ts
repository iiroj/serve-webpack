import path from "path";

import builder from "yargs";

export const yargs = builder
  .option("require", {
    alias: "r",
    description: "Preload the specified module at startup",
    type: "array",
    default: []
  })
  .coerce("require", (requires: string[]) => {
    const cwd = process.cwd();
    for (let requirePath of requires) {
      if (!path.isAbsolute(requirePath)) {
        requirePath = path.resolve(cwd, requirePath);
      }
      require(requirePath);
    }
  })
  .option("config", {
    alias: "c",
    description: "Relative path to Webpack configuration",
    type: "string",
    default: "webpack.config.js"
  })
  .option("hot", {
    alias: "h",
    description: "Enable websocket server for HMR support",
    type: "boolean",
    default: true
  })
  .option("env", {
    alias: "e",
    description: "Environment variables passed to Webpack configuration",
    type: "array"
  })
  .coerce("env", variables => {
    if (Array.isArray(variables)) {
      throw new Error(
        `Env variables should use object notation: --env.foo=bar`
      );
    }
    return variables;
  });
