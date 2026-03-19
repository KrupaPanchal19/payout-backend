import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { UserModel } from "../models/user_model";
import { ApiError } from "../utils/api_error";

export async function login_service(params: { email: string; password: string }) {
  const user = await UserModel.findOne({ email: params.email }).lean();
  if (!user) {
    throw new ApiError({
      status_code: 401,
      code: "UNAUTHORIZED",
      message: "Invalid email or password",
    });
  }

  const ok = await bcrypt.compare(params.password, user.password_hash);
  if (!ok) {
    throw new ApiError({
      status_code: 401,
      code: "UNAUTHORIZED",
      message: "Invalid email or password",
    });
  }

  if (!env.jwt_secret) {
    throw new ApiError({
      status_code: 500,
      code: "INTERNAL_ERROR",
      message: "JWT secret is not configured",
    });
  }

  

const token = jwt.sign(
  { sub: String(user?._id), role: user?.role, email: user?.email },
  process.env.JWT_SECRET as string,
  {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? "1d") as SignOptions["expiresIn"],
  }
);
  return {
    token,
    user: { id: String(user._id), email: user.email, role: user.role },
  };
}

