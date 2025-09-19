import type { DB } from "@/database/client";
import { schema } from "@/database/schema";
import { listUsersSchema } from "./model";

export class UserService {
  constructor(private readonly db: DB) {}

  async findAll() {
    const data = await this.db.select().from(schema.users).execute();

    return listUsersSchema.parse(data);
  }
}
