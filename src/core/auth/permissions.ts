import { createAccessControl } from "better-auth/plugins/access";

export const statement = {
  task: ["create", "view", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

const user = ac.newRole({
  task: ["create", "view", "update"],
});

const admin = ac.newRole({
  task: ["create", "view", "update", "delete"],
});

export const roles = {
  user,
  admin,
};
