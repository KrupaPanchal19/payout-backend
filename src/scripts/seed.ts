import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connect_db } from "../config/db";
import { env } from "../config/env";
import { UserModel } from "../models/user_model";

async function upsert_user(params: { email: string; password: string; role: "OPS" | "FINANCE" }) {
  const password_hash = await bcrypt.hash(params.password, 10);
  await UserModel.updateOne(
    { email: params.email },
    { $set: { email: params.email, password_hash, role: params.role } },
    { upsert: true },
  );
}

async function main() {
  await connect_db();

  await upsert_user({ email: "ops@demo.com", password: "ops123", role: "OPS" });
  await upsert_user({ email: "finance@demo.com", password: "fin123", role: "FINANCE" });

  // eslint-disable-next-line no-console
  console.log("Seed complete: users ensured");

  await mongoose.disconnect();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

