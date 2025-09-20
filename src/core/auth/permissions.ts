import { createAccessControl } from "better-auth/plugins/access";

export const statement = {
  user: ["view", "viewAll"],
  task: ["create", "view", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

const user = ac.newRole({
  user: ["view"],
  task: ["create", "view", "update"],
});

const admin = ac.newRole({
  user: ["view", "viewAll"],
  task: ["create", "view", "update", "delete"],
});

export const roles = {
  user,
  admin,
};
