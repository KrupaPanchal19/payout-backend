import { Router } from "express";
import { create_vendor_controller, delete_vendor_controller, get_vendor_by_id_controller, list_vendors_controller, update_vendor_by_id_controller } from "../controllers/vendor_controller";
import { auth_middleware } from "../middlewares/auth_middleware";
import { require_roles } from "../middlewares/rbac_middleware";
import { validate_body } from "../middlewares/validate_middleware";
import { create_vendor_body_schema } from "../validators/vendor_validation";
import { async_handler } from "../utils/async_handler";

export const vendor_routes = Router();

vendor_routes.get("/", auth_middleware, require_roles("OPS", "FINANCE"), async_handler(list_vendors_controller));
vendor_routes.post(
  "/",
  auth_middleware,
  require_roles("OPS"),
  validate_body(create_vendor_body_schema),
  async_handler(create_vendor_controller),
);

vendor_routes.delete("/:id", auth_middleware, require_roles("OPS", "FINANCE"), async_handler(delete_vendor_controller));
vendor_routes.get("/:id", auth_middleware, require_roles("OPS", "FINANCE"), async_handler(get_vendor_by_id_controller));
vendor_routes.put("/:id", auth_middleware, require_roles("OPS"), async_handler(update_vendor_by_id_controller));
