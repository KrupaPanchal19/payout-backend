import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api_error";
import type { UserRole } from "../types/auth_types";

export function require_roles(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = req.auth_user;
    if (!user) {
      throw new ApiError({
        status_code: 401,
        code: "UNAUTHORIZED",
        message: "Not authenticated",
      });
    }

    if (!roles.includes(user.role)) {
      throw new ApiError({
        status_code: 403,
        code: "FORBIDDEN",
        message: "Insufficient role",
      });
    }

    return next();
  };
}

