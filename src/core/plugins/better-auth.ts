import { Elysia } from "elysia";
import { auth as authClient } from "@/auth";
import { StatusCode } from "../http/status-code";

type AuthUserHasPermissionRequestParams = Parameters<
  typeof authClient.api.userHasPermission
>[0]["body"];

export const betterAuthPlugin = new Elysia({ name: "better-auth" })
  .mount(authClient.handler)
  .decorate("auth", authClient)
  .state(
    "session",
    null as null | Awaited<ReturnType<typeof authClient.api.getSession>>
  )
  .macro({
    auth: {
      async resolve({ status, auth, request: { headers }, store }) {
        const session = await auth.api.getSession({
          headers,
        });

        store.session = session;

        if (!session) {
          return status(StatusCode.UNAUTHORIZED, { error: "Unauthorized" });
        }

        return session;
      },
    },
    permissions: (
      permission: AuthUserHasPermissionRequestParams["permission"]
    ) => {
      return {
        async resolve({ status, auth, store }) {
          if (!permission) {
            return;
          }

          const { session } = store;

          if (!session) {
            return status(StatusCode.UNAUTHORIZED, { error: "Unauthorized" });
          }

          const { error, success } = await auth.api.userHasPermission({
            body: {
              userId: session.user.id,
              role: session.user
                .role as AuthUserHasPermissionRequestParams["role"],
              permission,
            },
          });

          if (error) {
            return status(StatusCode.INTERNAL_SERVER_ERROR, { error });
          }

          if (success) {
            return;
          }

          return status(StatusCode.FORBIDDEN, {
            error: "You do not have permission to perform this action.",
          });
        },
      };
    },
  });

let _schema: ReturnType<typeof authClient.api.generateOpenAPISchema> | null;
const getSchema = () => {
  _schema ??= authClient.api.generateOpenAPISchema();
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
