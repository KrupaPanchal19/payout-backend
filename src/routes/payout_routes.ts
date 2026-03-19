import { Router } from "express";
import {
  approve_payout_controller,
  create_payout_controller,
  delete_payout_controller,
  get_payout_controller,
  list_payouts_controller,
  reject_payout_controller,
  submit_payout_controller,
} from "../controllers/payout_controller";
import { auth_middleware } from "../middlewares/auth_middleware";
import { require_roles } from "../middlewares/rbac_middleware";
import { validate_body } from "../middlewares/validate_middleware";
import { async_handler } from "../utils/async_handler";
import { create_payout_body_schema, reject_payout_body_schema } from "../validators/payout_validation";

export const payout_routes = Router();

payout_routes.get("/", auth_middleware, require_roles("OPS", "FINANCE"), async_handler(list_payouts_controller));
payout_routes.post(
  "/",
  auth_middleware,
  require_roles("OPS"),
  validate_body(create_payout_body_schema),
  async_handler(create_payout_controller),
);
payout_routes.get("/:id", auth_middleware, require_roles("OPS", "FINANCE"), async_handler(get_payout_controller));
payout_routes.post("/:id/submit", auth_middleware, require_roles("OPS"), async_handler(submit_payout_controller));
payout_routes.post("/:id/approve", auth_middleware, require_roles("FINANCE"), async_handler(approve_payout_controller));
payout_routes.post(
  "/:id/reject",
  auth_middleware,
  require_roles("FINANCE"),
  validate_body(reject_payout_body_schema),
  async_handler(reject_payout_controller),
);

payout_routes.delete("/:id", auth_middleware, require_roles("OPS"), async_handler(delete_payout_controller));

