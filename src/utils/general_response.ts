import type { Response } from "express";

export function general_response<T>(res: Response, params: {
  status_code?: number;
  message: string;
  data?: T;
}): Response {
  const status_code = params.status_code ?? 200;
  return res.status(status_code).json({
    success: true,
    message: params.message,
    data: params.data ?? null,
  });
}

