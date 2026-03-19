import { Router } from "express";
import { login_controller, me_controller } from "../controllers/auth_controller";
import { async_handler } from "../utils/async_handler";
import { validate_body } from "../middlewares/validate_middleware";
import { login_body_schema } from "../validators/auth_validation";
import { auth_middleware } from "../middlewares/auth_middleware";

export const auth_routes = Router();

auth_routes.post("/login", validate_body(login_body_schema), async_handler(login_controller));
auth_routes.get("/me", auth_middleware, async_handler(me_controller));
