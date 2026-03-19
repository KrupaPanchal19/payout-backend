import type { Request, Response } from "express";
import {
  approve_payout_service,
  create_payout_service,
  get_payout_service,
  list_payouts_service,
  reject_payout_service,
  submit_payout_service,
  delete_payout_service,
} from "../services/payout_service";
import { ApiError } from "../utils/api_error";
import { general_response } from "../utils/general_response";

export async function list_payouts_controller(_req: Request, res: Response) {
  // NOTE: We need to read query params here, otherwise filtering never happens.
  // Example: GET /api/payouts?status=Submitted
  const { status } = _req.query;

  const payouts = await list_payouts_service({
    status: typeof status === "string" ? status : undefined,
  });
  return general_response(res, { message: "Payouts fetched", data: payouts });
}

export async function get_payout_controller(req: Request, res: Response) {
  const result = await get_payout_service(req.params.id as string);
  return general_response(res, { message: "Payout fetched", data: result });
}

export async function create_payout_controller(req: Request, res: Response) {
  if (!req.auth_user) {
    throw new ApiError({ status_code: 401, code: "UNAUTHORIZED", message: "Not authenticated" });
  }
  const payout = await create_payout_service(req.body, req.auth_user);
  return general_response(res, { status_code: 201, message: "Payout created", data: payout });
}

export async function submit_payout_controller(req: Request, res: Response) {
  if (!req.auth_user) {
    throw new ApiError({ status_code: 401, code: "UNAUTHORIZED", message: "Not authenticated" });
  }
  const payout = await submit_payout_service(req.params.id as string, req.auth_user);
  return general_response(res, { message: "Payout submitted", data: payout });
}

export async function approve_payout_controller(req: Request, res: Response) {
  if (!req.auth_user) {
    throw new ApiError({ status_code: 401, code: "UNAUTHORIZED", message: "Not authenticated" });
  }
  const payout = await approve_payout_service(req.params.id as string, req.auth_user);
  return general_response(res, { message: "Payout approved", data: payout });
}

export async function reject_payout_controller(req: Request, res: Response) {
  if (!req.auth_user) {
    throw new ApiError({ status_code: 401, code: "UNAUTHORIZED", message: "Not authenticated" });
  }
  const payout = await reject_payout_service(req.params.id as string, req.body.reason, req.auth_user);
  return general_response(res, { message: "Payout rejected", data: payout });
}

export async function delete_payout_controller(req: Request, res: Response) {
  if (!req.auth_user) {
    throw new ApiError({ status_code: 401, code: "UNAUTHORIZED", message: "Not authenticated" });
  }

  await delete_payout_service(req.params.id as string, req.auth_user);
  return general_response(res, { message: "Payout deleted", data: { deleted: true } });
}

