import openapi from "@elysiajs/openapi";
import { Elysia } from "elysia";
import z from "zod";
import { betterAuthPlugin, OpenAPI } from "./core/plugins/better-auth";
import { logger } from "./logger";
import { tasks } from "./modules/task";

const PORT = 3001;

const app = new Elysia()
  .use(
    openapi({
      documentation: {
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths(),
      },
      mapJsonSchema: {
        zod: z.toJSONSchema,
      },
    })
  )
  .use(betterAuthPlugin)
  .use(tasks)
  .listen(PORT);

logger.info(`🦊 Elysia is running at ${app.server?.url}`);
