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

  const wsUrl = `${resolvedUrl}/${socketPath}`
    .replace(/https:\/\//, "wss://")
    .replace(/http:\/\//, "ws://");
  logger.info(`HMR support enabled at ${wsUrl}`);

  let latestStats: Stats.ToJsonOutput;

  compiler.hooks.watchRun.tap("serve-webpack", () => {
    ws.clients.forEach(ws => {
      if (!(ws as OnlineWebSocket).online) return ws.ping();
      ws.send(JSON.stringify({ type: "start", payload: latestStats.hash }));
    });
  });

  compiler.hooks.done.tap("serve-webpack", stats => {
    const jsonStats = stats.toJson({ all: false, hash: true, modules: true });
    latestStats = jsonStats;

    const modules =
      jsonStats.modules &&
      jsonStats.modules.reduce(
        (obj, mod) => {
          obj[mod.id] = mod.name;
          return obj;
        },
        {} as Record<string, string>
      );

    ws.clients.forEach(ws => {
      if (!(ws as OnlineWebSocket).online) return ws.ping();
      ws.send(
        JSON.stringify({
          type: "done",
          payload: { hash: jsonStats.hash, modules }
        })
      );
    });
  });

  compiler.hooks.failed.tap("serve-webpackr", error => {
    ws.clients.forEach(ws => {
      if (!(ws as OnlineWebSocket).online) return ws.ping();
      ws.send(JSON.stringify({ type: "error", payload: error.message }));
    });
  });
};
