import path from "path";
import { Configuration } from "webpack";
import defaultsDeep from "lodash.defaultsdeep";
import serveHandler from "serve-handler";
import { URL } from "url";

export type ServeHandlerOptions = NonNullable<
  Parameters<typeof serveHandler>[2]
>;

export type ServeConfig = ServeHandlerOptions & {
  protocol?: "http:" | "https:";
  host?: string;
  port?: number;
  socketPath?: string;
  path?: string;
  publicPath?: string;
  resolvedUrl?: string;
};

declare module "webpack" {
  interface Configuration {
    serve?: Omit<ServeConfig, "resolvedUrl">;
  }
}

/**
 * Default serve-webpack configuration
 */
export const getDefaultConfig = (
  path?: string,
  publicPath?: string
): ServeConfig => ({
  protocol: "http:",
  host: "localhost",
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  socketPath: "/__socket",
  path,
  publicPath
});

const cwd = process.cwd();

const inferPort = (
  protocol: ServeConfig["protocol"],
  port?: number
): string => {
  if (protocol === "https:") return port === 443 ? "" : `:${port}`;
  else if (protocol === "http:") return port === 80 ? "" : `:${port}`;
  else if (port) return `:${port}`;
  return "";
};

type Env = Record<string, string | boolean>;
type FnConfiguration = (env: Env) => Configuration;
type WebpackConfiguration = Configuration | FnConfiguration;

/**
 * Get Webpack Configuration from relative path
 * @param relativePath Relative path to the Webpack Configuration
 * @param env Parsed environment variables (`--env`) passed to the Function Configuration
 */
export const getConfig = async (
  relativePath = "webpack.config.js",
  env: Env = {}
): Promise<{ webpackConfig: Configuration; serveConfig: ServeConfig }> => {
  const resolvedPath = path.resolve(cwd, relativePath);
  let webpackConfig: WebpackConfiguration | WebpackConfiguration[] = {};

  try {
    const { default: defaultImport } = await import(resolvedPath);
    webpackConfig = defaultImport;
  } catch {
    throw new Error(`Webpack configuration not found at ${resolvedPath}`);
  }

  if (Array.isArray(webpackConfig)) {
    console.warn(
      "Multiple Webpack configurations detected! serve-webpack only supports one so first will be used"
    );
    webpackConfig = webpackConfig[0];
  }

  if (typeof webpackConfig === "function") {
    webpackConfig = webpackConfig(env);
  }

  const { path: buildPath, publicPath } = webpackConfig.output || {};

  const serveConfig: ServeConfig = defaultsDeep(
    { ...webpackConfig.serve },
    getDefaultConfig(buildPath, publicPath)
  );

  const { host, port, protocol, socketPath } = serveConfig;

  // Create resolved full url
  serveConfig.resolvedUrl = new URL(
    `${protocol}//${host}${inferPort(protocol, port)}`
  )
    .toString()
    .replace(/\/$/, "");

  // Normalize socketPath
  serveConfig.socketPath = socketPath!.replace(/^\//, "");

  // Delete invalid entry from webpack config before passing to compiler
  delete webpackConfig.serve;

  return { webpackConfig, serveConfig };
};
