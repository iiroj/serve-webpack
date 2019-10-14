import { Entry, Configuration, HotModuleReplacementPlugin } from "webpack";

import { ServeConfig } from "./config";

const ENTRY_POINT = "serve-webpack/client";

const prependEntry = async (
  entry: Configuration["entry"],
  prepended: string[]
): Promise<string | string[] | Entry> => {
  if (!entry) {
    return prepended;
  }

  if (typeof entry === "function") {
    return prependEntry(await entry(), prepended);
  }

  if (Array.isArray(entry)) {
    const unique: string[] = [];
    prepended.forEach(prep => {
      if (!entry.includes(prep)) {
        unique.push(prep);
      }
    });
    return [...prepended, ...unique];
  }

  if (typeof entry === "object") {
    const clone: Entry = {};
    for (const key of Object.keys(entry)) {
      clone[key] = (await prependEntry(entry[key], prepended)) as string[];
    }
    return clone;
  }

  return [...prepended, entry];
};

/**
 * Add webpack entrypoints for HMR support
 * @param webpackConfig
 * @param serveConfig
 */
export const addEntries = async (
  webpackConfig: Configuration,
  { resolvedUrl, socketPath }: ServeConfig
): Promise<void> => {
  const hotEntry = `${ENTRY_POINT}?url=${resolvedUrl}/${socketPath}`;
  webpackConfig.entry = await prependEntry(webpackConfig.entry, [hotEntry]);

  if (!webpackConfig.plugins) {
    webpackConfig.plugins = [];
  }

  if (
    !webpackConfig.plugins.some(
      plugin => plugin.constructor.name === "HotModuleReplacementPlugin"
    )
  ) {
    webpackConfig.plugins.push(new HotModuleReplacementPlugin());
  }
};
