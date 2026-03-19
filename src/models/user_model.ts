import mongoose, { Schema } from "mongoose";
import type { UserRole } from "../types/auth_types";

export interface UserDoc {
  _id: mongoose.Types.ObjectId;
  email: string;
  password_hash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const user_schema = new Schema<UserDoc>(
  {
    email: { type: String, required: true, unique: true, index: true },
    password_hash: { type: String, required: true },
    role: { type: String, required: true, enum: ["OPS", "FINANCE"] },
  },
  { timestamps: true, collection: "users" },
);

export const UserModel =
  (mongoose.models.User as mongoose.Model<UserDoc>) ??
  mongoose.model<UserDoc>("User", user_schema);

