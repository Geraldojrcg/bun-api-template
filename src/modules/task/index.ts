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
    async ({ db }) => {
      const service = new TasksService(db);

      const response = await service.findAll();

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
    async ({ status, db, params: { id } }) => {
      const service = new TasksService(db);

      const response = await service.findById(id);

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
    }
  )
  .post(
    "/",
    async ({ db, body }) => {
      const service = new TasksService(db);

      const response = await service.create(body);

      return response;
    },
    {
      body: createTaskSchema,
      response: {
        201: taskSchema,
        404: errorSchema,
      },
    }
  )
  .put(
    "/:id",
    async ({ status, db, params: { id }, body }) => {
      const service = new TasksService(db);

      const response = await service.update(id, body);

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
    }
  )
  .delete(
    "/:id",
    async ({ status, db, params: { id } }) => {
      const service = new TasksService(db);

      const response = await service.delete(id);

      if (!response) {
        return status(StatusCode.NOT_FOUND, { error: "Error deleting task" });
      }

      return status(StatusCode.NO_CONTENT, {});
    },
    {
      params: z.object({
        id: z.uuid("v7"),
      }),
      response: {
        204: z.object({}),
        404: errorSchema,
      },
    }
  );
