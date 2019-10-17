import { Server } from "http";
import serveHandler from "serve-handler";
import { URL } from "url";

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
    publicPath = "/",
    resolvedUrl,
    ...rest
  } = config;

  const serveConfig = { ...rest, public: path };
  const { pathname } = new URL(publicPath, resolvedUrl);
  const pathPrefixRegex = new RegExp(`^${pathname}`);

  server.on("request", (req, res) => {
    if (req.url === config.socketPath) return;
    let rewrite = req.url.replace(pathPrefixRegex, "");
    if (!rewrite.startsWith("/")) rewrite = `/${rewrite}`;
    serveHandler({ ...req, url: rewrite }, res, serveConfig);
  });
};
