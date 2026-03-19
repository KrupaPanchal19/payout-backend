import { Router } from "express";
import { auth_routes } from "./auth_routes";
import { vendor_routes } from "./vendor_routes";
import { payout_routes } from "./payout_routes";

export const api_router = Router();

api_router.use("/auth", auth_routes);
api_router.use("/vendors", vendor_routes);
api_router.use("/payouts", payout_routes);

