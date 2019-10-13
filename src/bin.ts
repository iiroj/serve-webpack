#!/usr/bin/env node

import { yargs } from "./yargs";

yargs.command(
  "*",
  "",
  yargs => yargs,
  async argv => {
    const { handler } = await import("./handler");
    handler(argv);
  }
).argv;
