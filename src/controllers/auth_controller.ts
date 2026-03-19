import type { Request, Response } from "express";
import { login_service } from "../services/auth_service";
import { general_response } from "../utils/general_response";

export async function login_controller(req: Request, res: Response) {
  const result = await login_service({ email: req.body.email, password: req.body.password });
  return general_response(res, { status_code: 200, message: "Login successful", data: result });
}

export async function me_controller(req: Request, res: Response) {
  return general_response(res, {
    status_code: 200,
    message: "Current user",
    data: req.auth_user ?? null,
  });
}

