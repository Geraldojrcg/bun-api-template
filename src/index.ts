import openapi from "@elysiajs/openapi";
import { Elysia } from "elysia";
import z from "zod";
import { betterAuth, OpenAPI } from "./core/plugins/better-auth";
import { logger } from "./logger";
import { users } from "./modules/users";

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
  .use(betterAuth)
  .use(users)
  .listen(PORT);

logger.info(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
