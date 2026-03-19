import cors from "cors";
import express from "express";
import helmet from "helmet";
import "./types/express_types";
import { api_router } from "./routes";
import { error_middleware } from "./middlewares/error_middleware";

export function build_app() {
  const app = express();

  const corsOptions = {
    origin: true,            // reflect origin dynamically
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };
  
  app.use(helmet());
  
  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions)); // important: same options

  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.use("/api", api_router);

  app.use(error_middleware);

  return app;
}

