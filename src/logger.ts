import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, colorize } = format;

const logFormat = printf((info) => {
  return `${info.timestamp} [${(info.source as string) ?? "app"}] [${info.level}]: ${info.message}`;
});

export const logger = createLogger({
  format: combine(
    colorize({
      all: true,
    }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat
  ),
  transports: [new transports.Console()],
});
