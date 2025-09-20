import z from "zod";

export const taskSchema = z.object({
  id: z.uuid("v7"),
  userId: z.uuid("v7"),
  title: z.string().min(1).max(255),
  description: z.string().max(1000),
  status: z.enum(["pending", "in_progress", "completed"]).optional(),
  createdAt: z.iso.date().optional(),
  updatedAt: z.iso.date().optional(),
});

export const listTasksSchema = taskSchema.array();

export const createTaskSchema = taskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateTaskSchema = createTaskSchema
  .partial()
  .omit({ userId: true });

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;
