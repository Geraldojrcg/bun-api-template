import { eq } from "drizzle-orm";
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

  async findAll() {
    const data = await this.db.select().from(schema.tasks).execute();

    return listTasksSchema.parse(data);
  }

  async findById(id: string) {
    const [task] = await this.db
      .select()
      .from(schema.tasks)
      .where(eq(schema.tasks.id, id))
      .execute();

    return taskSchema.parse(task);
  }

  async create(data: CreateTaskSchema) {
    const [task] = await this.db
      .insert(schema.tasks)
      .values(data)
      .returning()
      .execute();

    return taskSchema.parse(task);
  }

  async update(id: string, data: UpdateTaskSchema) {
    const [task] = await this.db
      .update(schema.tasks)
      .set(data)
      .where(eq(schema.tasks.id, id))
      .returning()
      .execute();

    return taskSchema.parse(task);
  }

  async delete(id: string) {
    const [task] = await this.db
      .delete(schema.tasks)
      .where(eq(schema.tasks.id, id))
      .returning()
      .execute();

    return taskSchema.parse(task);
  }
}
