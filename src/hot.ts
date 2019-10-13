import { Server as HTTPServer } from "http";
import { Compiler, Stats } from "webpack";

import { ServeConfig } from "./config";
import { OnlineWebSocket, createWsServer } from "./ws";
import { logger } from "./logger";

export const useHotMiddleware = (
  server: HTTPServer,
  compiler: Compiler,
  { socketPath, resolvedUrl }: ServeConfig
): void => {
  const ws = createWsServer(server, socketPath!);
  logger.info(`HMR support enabled at ${resolvedUrl}/${socketPath}`);

  let latestStats: Stats.ToJsonOutput;

  const createInvalidHandler = (status: string) => (): void => {
    ws.clients.forEach(ws => {
      if (!(ws as OnlineWebSocket).online) return ws.ping();
      ws.send({ hash: latestStats.hash, builtAt: latestStats.builtAt, status });
    });
  };

  compiler.hooks.invalid.tap("webpack-serve", createInvalidHandler("invalid"));
  compiler.hooks.compile.tap("webpack-serve", createInvalidHandler("compile"));

  compiler.hooks.done.tap("webpack-serve", stats => {
    const jsonStats = stats.toJson({ all: false, hash: true, builtAt: true });
    const isUpdated = jsonStats.hash !== latestStats.hash;
    if (isUpdated) latestStats = jsonStats;
    ws.clients.forEach(ws => {
      if (!(ws as OnlineWebSocket).online) return ws.ping();
      if (isUpdated) ws.send({ ...jsonStats, status: "done" });
    });
  });

  compiler.hooks.failed.tap("webpack-server", error => {
    ws.clients.forEach(ws => {
      if (!(ws as OnlineWebSocket).online) return ws.ping();
      ws.send({ status: "error", message: error.message });
    });
  });
};
