import Elysia from "elysia";
import { betterAuth } from "@/core/plugins/better-auth";
import { db } from "@/database/client";
import { listUsersSchema } from "./model";
import { UserService } from "./service";

export const users = new Elysia({
  name: "users",
  prefix: "/users",
  tags: ["Users"],
})
  .use(betterAuth)
  .guard({
    auth: true,
  })
  .get(
    "/",
    async () => {
      const service = new UserService(db);

      const response = await service.findAll();

      return response;
    },
    {
      response: {
        200: listUsersSchema,
      },
    }
  );
