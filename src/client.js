let lastHash;

const applyOptions = {
  ignoreUnaccepted: true,
  ignoreDeclined: true,
  ignoreErrored: true,
  onUnaccepted: data =>
    console.warn(`[ws] unaccepted module ${data.chain.join(" -> ")}`),
  onDeclined: data =>
    console.warn(`[ws] declined module ${data.chain.join(" -> ")}`),
  onErrored: data =>
    console.warn(
      `[ws] error while updating module ${data.moduleId} (${data.type})`
    )
};

const upToDate = hash => {
  if (hash) lastHash = hash;
  /* eslint-disable-next-line @typescript-eslint/camelcase */
  return __webpack_hash__ === lastHash;
};

async function hotUpdate(hash, modules) {
  if (module.hot.status() !== "idle") return;
  try {

    const outdatedModules = await module.hot.check(applyOptions);
    for (const id of outdatedModules) {
      const name = modules[id];
      if (name) {
        console.debug(`[ws] updated module ${modules[id]}`);
      }
    }
  } catch (error) {
    console.error(`[ws] error during hot update`, error)
  }
}

function hot() {
  if (!__resourceQuery) throw new Error("Missing Webpack __resourceQuery!");
  const resource = new URLSearchParams(__resourceQuery);

  const serveUri = resource.get("url");
  if (!serveUri) throw new Error("Missing serve-webpack socket uri!");

  const socketUri = serveUri
    .replace(/https:\/\//, "wss://")
    .replace(/http:\/\//, "ws://");

  const socket = new WebSocket(socketUri);

  socket.addEventListener("open", () => {
    console.info(`[ws] websocket opened to ${socketUri}`);
  });

  socket.addEventListener("close", () => {
    console.warn(`[ws] websocket closed`);
  });

  socket.addEventListener("message", event => {
    const { type, payload } = JSON.parse(event.data);
    switch (type) {
      case "start":
        return console.info(`[ws] building...`);
      case "done":
        const { hash, modules } = payload;
        const isUpToDate = upToDate(hash);
        console.info(
          isUpToDate ? `[ws] up to date at ${hash}` : `[ws] built ${hash}`
        );
        return isUpToDate || hotUpdate(hash, modules);
      case "error":
        return console.error(`[ws] error during compilation`, payload);
    }
  });
}

hot();
