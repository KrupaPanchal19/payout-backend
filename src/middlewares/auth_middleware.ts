import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "../utils/api_error";
import type { UserRole } from "../types/auth_types";

type JwtPayload = {
  sub: string;
  role: UserRole;
  email: string;
  iat?: number;
  exp?: number;
};

export function auth_middleware(req: Request, _res: Response, next: NextFunction) {
  const auth_header = req.header("authorization") ?? "";
  const token = auth_header.startsWith("Bearer ") ? auth_header.slice(7) : "";

  if (!token) {
    throw new ApiError({
      status_code: 401,
      code: "UNAUTHORIZED",
      message: "Missing Bearer token",
    });
  }

  if (!env.jwt_secret) {
    throw new ApiError({
      status_code: 500,
      code: "INTERNAL_ERROR",
      message: "JWT secret is not configured",
    });
  }

  try {
    const payload = jwt.verify(token, env.jwt_secret) as JwtPayload;
    req.auth_user = { id: payload.sub, role: payload.role, email: payload.email };
    return next();
  } catch {
    throw new ApiError({
      status_code: 401,
      code: "UNAUTHORIZED",
      message: "Invalid or expired token",
    });
  }
}

