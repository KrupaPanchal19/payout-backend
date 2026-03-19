import mongoose from "mongoose";
import { env } from "./env";

export async function connect_db(): Promise<void> {
  if (!env.mongodb_uri) {
    throw new Error("MONGODB_URI is missing");
  }

  await mongoose.connect(env.mongodb_uri);
}

