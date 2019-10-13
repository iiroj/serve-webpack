const bindLogger = (logger: Function) =>
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  function log(this: any, ...args: any[]): void {
    logger.call(logger, "[ws]", ...args);
  };

export const logger = {
  debug: bindLogger(console.debug),
  info: bindLogger(console.info),
  warn: bindLogger(console.warn),
  error: bindLogger(console.error)
};
