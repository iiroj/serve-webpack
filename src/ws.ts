import { Server } from "http";
import WebSocket from "ws";

export declare class OnlineWebSocket extends WebSocket {
  online: boolean;
}

export const createWsServer = (
  server: Server,
  path: string
): WebSocket.Server => {
  const ws = new WebSocket.Server({ server, path });

  ws.on("connection", (ws: OnlineWebSocket) => {
    ws.online = true;
    ws.on("pong", (ws: OnlineWebSocket) => {
      ws.online = true;
    });
  });

  const interval = setInterval(() => {
    ws.clients.forEach(ws => {
      if (!(ws as OnlineWebSocket).online) return ws.terminate();
      (ws as OnlineWebSocket).online = false;
      ws.ping();
    });
  }, 30000);

  server.on("close", () => {
    clearInterval(interval);
    ws.clients.forEach(ws => {
      ws.terminate();
    });
  });

  return ws;
};
