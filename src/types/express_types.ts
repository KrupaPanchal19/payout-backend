import type { AuthUser } from "./auth_types";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth_user?: AuthUser;
    }
  }
}

export {};

