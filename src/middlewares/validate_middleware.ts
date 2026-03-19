import type { NextFunction, Request, Response } from "express";
import type { ObjectSchema } from "joi";
import { ApiError } from "../utils/api_error";

export function validate_body(schema: ObjectSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      throw new ApiError({
        status_code: 400,
        code: "VALIDATION_ERROR",
        message: "Invalid request body",
        details: error.details.map((d) => ({
          message: d.message,
          path: d.path,
          type: d.type,
        })),
      });
    }

    req.body = value;
    next();
  };
}

