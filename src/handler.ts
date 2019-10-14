import { createServer } from "http";
import webpack from "webpack";

import { getConfig } from "./config";
import { logger } from "./logger";
import { useServeMiddleware } from "./serve";
import { addEntries } from "./entrypoint";

const watchHandler: webpack.ICompiler.Handler = (error, stats) => {
  if (error) {
    return logger.error(error);
  }

  const { errors, warnings, hash } = stats.toJson({
    all: false,
    hash: true,
    builtAt: true
  });

  for (const error of errors) {
    logger.error(error);
  }

  for (const warning of warnings) {
    logger.warn(warning);
  }

  logger.info(`built ${hash}`);
};

type Argv = {
  config: string;
  env: Record<string, string | boolean>;
  hot: boolean;
};

/**
 * Main serve-webpack handler
 * @param argv command-line arguments
 */
export const handler = async ({ config, env, hot }: Argv): Promise<void> => {
  const { webpackConfig, serveConfig } = await getConfig(config, env);

  if (hot) {
    await addEntries(webpackConfig, serveConfig);
  }

  const compiler = webpack(webpackConfig);
  compiler.watch(webpackConfig.watchOptions || {}, watchHandler);
  compiler.hooks.compile.tap("serve-webpack", () =>
    logger.info("compiling...")
  );

  const server = createServer();
  server.listen(serveConfig.port, () => {
    logger.info(`listening at ${serveConfig.resolvedUrl}`);
  });

  useServeMiddleware(server, serveConfig);

  if (hot) {
    const { useHotMiddleware } = await import("./hot");
    useHotMiddleware(server, compiler, serveConfig);
  }
};
