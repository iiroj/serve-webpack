import { Server } from "http";
import serveHandler from "serve-handler";

import { ServeConfig } from "./config";

export const useServeMiddleware = (
  server: Server,
  config: ServeConfig
): void => {
  const {
    protocol,
    host,
    port,
    socketPath,
    path,
    publicPath,
    resolvedUrl,
    ...rest
  } = config;

  const serveConfig = { ...rest, public: path };

  server.on("request", (req, res) => {
    if (req.url === config.socketPath) return;
    serveHandler(req, res, serveConfig);
  });
};
