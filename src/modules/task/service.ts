import { and, eq } from "drizzle-orm";
import type { DB } from "@/database/client";
import { schema } from "@/database/schema";
import {
  type CreateTaskSchema,
  listTasksSchema,
  taskSchema,
  type UpdateTaskSchema,
} from "./model";

export class TasksService {
  constructor(private readonly db: DB) {}

  async findAll(userId?: string) {
    const filter = userId ? eq(schema.tasks.userId, userId) : undefined;

    const data = await this.db
      .select()
      .from(schema.tasks)
      .where(filter)
      .execute();

    return listTasksSchema.parse(data);
  }

  async findById(id: string, userId?: string) {
    const filter = userId ? eq(schema.tasks.userId, userId) : undefined;

    const [task] = await this.db
      .select()
      .from(schema.tasks)
      .where(and(eq(schema.tasks.id, id), filter))
      .execute();

    return taskSchema.parse(task);
  }

  async create(data: CreateTaskSchema, userId: string) {
    const [task] = await this.db
      .insert(schema.tasks)
      .values({ ...data, userId })
      .returning()
      .execute();

    return taskSchema.parse(task);
  }

  async update(id: string, data: UpdateTaskSchema, userId?: string) {
    const filter = userId ? eq(schema.tasks.userId, userId) : undefined;

    const [task] = await this.db
      .update(schema.tasks)
      .set(data)
      .where(and(eq(schema.tasks.id, id), filter))
      .returning()
      .execute();

    if (!task) {
      return null;
    }

    return taskSchema.parse(task);
  }

  async delete(id: string) {
    const [row] = await this.db
      .delete(schema.tasks)
      .where(eq(schema.tasks.id, id))
      .returning({
        deletedId: schema.tasks.id,
      })
      .execute();

    if (!row) {
      return null;
    }

    return row.deletedId;
  }
}
