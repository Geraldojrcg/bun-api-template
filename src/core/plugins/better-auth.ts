import { Elysia } from "elysia";
import { auth } from "@/auth";
import { StatusCode } from "../http/status-code";

export const betterAuthPlugin = new Elysia({ name: "better-auth" })
  .mount(auth.handler)
  .macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({
          headers,
        });

        if (!session) {
          return status(StatusCode.UNAUTHORIZED, { error: "Unauthorized" });
        }

        return session;
      },
    },
  });

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema> | null;
const getSchema = () => {
  _schema ??= auth.api.generateOpenAPISchema();
  return _schema;
};

export const OpenAPI = {
  getPaths: (prefix = "/auth") =>
    getSchema().then(({ paths }) => {
      const reference: typeof paths = Object.create(null);

      for (const path of Object.keys(paths)) {
        const key = prefix + path;
        reference[key] = paths[path];

        for (const method of Object.keys(paths[path])) {
          // biome-ignore lint/suspicious/noExplicitAny: better auth
          const operation = (reference[key] as Record<string, any>)[method];

          operation.tags = ["Better Auth"];
        }
      }

      return reference;
      // biome-ignore lint/suspicious/noExplicitAny: better auth
    }) as Promise<any>,
  // biome-ignore lint/suspicious/noExplicitAny: better auth
  components: getSchema().then(({ components }) => components) as Promise<any>,
} as const;
