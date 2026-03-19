export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "BAD_REQUEST"
  | "INTERNAL_ERROR";

export class ApiError extends Error {
  public readonly status_code: number;
  public readonly code: ApiErrorCode;
  public readonly details?: unknown;

  constructor(params: {
    status_code: number;
    code: ApiErrorCode;
    message: string;
    details?: unknown;
  }) {
    super(params.message);
    this.status_code = params.status_code;
    this.code = params.code;
    this.details = params.details;
  }
}

