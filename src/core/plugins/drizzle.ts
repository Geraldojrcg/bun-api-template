import Elysia from "elysia";
import { db } from "@/database/client";

export const drizzlePlugin = new Elysia({ name: "drizzle-database" }).decorate(
  "db",
  db
);
