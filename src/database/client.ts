import { DefaultLogger, type LogWriter } from "drizzle-orm";
import { drizzle } from "drizzle-orm/bun-sql";
import { env } from "@/env";
import { logger } from "@/logger";
import { schema } from "./schema";

class CustomLogWriter implements LogWriter {
  write(message: string) {
    logger.info(message, { source: "drizzle-orm" });
  }
}
const defaultLogger = new DefaultLogger({ writer: new CustomLogWriter() });

export const db = drizzle(env.DATABASE_URL, {
  schema,
  casing: "snake_case",
  logger: defaultLogger,
});

export type DB = typeof db;
