import z from "zod";

export const userSchema = z.object({
  id: z.uuid("v7"),
  name: z.string().min(2).max(100),
  email: z.email(),
  emailVerified: z.boolean().optional(),
  image: z.url().nullable().optional(),
  createdAt: z.iso.date().optional(),
  updatedAt: z.iso.date().optional(),
});

export const listUsersSchema = userSchema.array();

export const createUserSchema = userSchema.omit({
  id: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
});

export const updateUserSchema = userSchema
  .omit({ createdAt: true, updatedAt: true })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });
