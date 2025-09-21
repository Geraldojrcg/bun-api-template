import Elysia from "elysia";
import z from "zod";
import { errorSchema } from "@/core/http/schema";
import { StatusCode } from "@/core/http/status-code";
import { betterAuthPlugin } from "@/core/plugins/better-auth";
import { drizzlePlugin } from "@/core/plugins/drizzle";
import {
  createTaskSchema,
  listTasksSchema,
  taskSchema,
  updateTaskSchema,
} from "./model";
import { TasksService } from "./service";

export const tasks = new Elysia({
  name: "tasks",
  prefix: "/tasks",
  tags: ["Tasks"],
})
  .model("Task", taskSchema)
  .use(betterAuthPlugin)
  .use(drizzlePlugin)
  .guard({
    auth: true,
  })
  .get(
    "/",
    async ({ db, user }) => {
      const service = new TasksService(db);

      const response = await service.findAll(
        user.role === "admin" ? undefined : user.id
      );

      return response;
    },
    {
      response: {
        200: listTasksSchema,
      },
    }
  )
  .get(
    "/:id",
    async ({ status, db, user, params: { id } }) => {
      const service = new TasksService(db);

      const response = await service.findById(
        id,
        user.role === "admin" ? undefined : user.id
      );

      if (!response) {
        return status(StatusCode.NOT_FOUND, { error: "Task not found" });
      }

      return response;
    },
    {
      params: z.object({
        id: z.uuid("v7"),
      }),
      response: {
        200: taskSchema,
        404: errorSchema,
      },
      permissions: {
        task: ["view"],
      },
    }
  )
  .post(
    "/",
    async ({ db, user, body }) => {
      const service = new TasksService(db);

      const response = await service.create(body, user.id);

      return response;
    },
    {
      body: createTaskSchema,
      response: {
        201: taskSchema,
        404: errorSchema,
      },
      permissions: {
        task: ["create"],
      },
    }
  )
  .put(
    "/:id",
    async ({ status, db, user, params: { id }, body }) => {
      const service = new TasksService(db);

      const response = await service.update(
        id,
        body,
        user.role === "admin" ? undefined : user.id
      );

      if (!response) {
        return status(StatusCode.NOT_FOUND, { error: "Task not found" });
      }

      return response;
    },
    {
      params: z.object({
        id: z.uuid("v7"),
      }),
      body: updateTaskSchema,
      response: {
        200: taskSchema,
        404: errorSchema,
      },
      permissions: {
        task: ["update"],
      },
    }
  )
  .delete(
    "/:id",
    async ({ status, db, params: { id } }) => {
      const service = new TasksService(db);

      const response = await service.delete(id);

      if (!response) {
        return status(StatusCode.NOT_FOUND, { error: "Task not found" });
      }

      return status(StatusCode.NO_CONTENT, null);
    },
    {
      params: z.object({
        id: z.uuid("v7"),
      }),
      response: {
        204: z.null(),
        404: errorSchema,
      },
      permissions: {
        task: ["delete"],
      },
    }
  );
