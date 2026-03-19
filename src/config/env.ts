import dotenv from "dotenv";

dotenv.config();

export const env = {
  node_env: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? "4000"),
  mongodb_uri: process.env.MONGODB_URI ?? "",
  jwt_secret: process.env.JWT_SECRET ?? "",
  jwt_expires_in: process.env.JWT_EXPIRES_IN ?? "1d",
} as const;

