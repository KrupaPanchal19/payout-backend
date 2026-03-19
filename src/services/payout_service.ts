import mongoose from "mongoose";
import { PayoutModel } from "../models/payout_model";
import { PayoutAuditModel } from "../models/payout_audit_model";
import { VendorModel } from "../models/vendor_model";
import type { AuthUser } from "../types/auth_types";
import { ApiError } from "../utils/api_error";
import type { PayoutStatus } from "../types/domain_types";

export async function list_payouts_service(filters?: { status?: string }) {
  const query: Record<string, unknown> = {};

  if (filters?.status) {
    const allowed: PayoutStatus[] = ["Draft", "Submitted", "Approved", "Rejected"];
    const statusRaw = filters.status;
    const status = allowed.find((s) => s.toLowerCase() === statusRaw.toLowerCase());
    if (!status) {
      throw new ApiError({
        status_code: 400,
        code: "VALIDATION_ERROR",
        message: `Invalid status. Allowed: ${allowed.join(", ")}`,
      });
    }
    query.status = status;
  }

  return PayoutModel.find(query)
    .sort({ createdAt: -1 })
    .populate("vendor_id")
    .lean();
}

export async function get_payout_service(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError({ status_code: 400, code: "VALIDATION_ERROR", message: "Invalid payout id" });
  }

  const payout = await PayoutModel.findById(id).populate("vendor_id").lean();
  if (!payout) {
    throw new ApiError({ status_code: 404, code: "NOT_FOUND", message: "Payout not found" });
  }
  const audits = await PayoutAuditModel.find({ payout_id: payout._id }).sort({ createdAt: 1 }).lean();
  return { payout, audits };
}

export async function create_payout_service(
  body: { vendor_id: string; amount: number; mode: "UPI" | "IMPS" | "NEFT"; note?: string | null },
  actor: AuthUser,
) {
  if (!mongoose.isValidObjectId(body.vendor_id)) {
    throw new ApiError({ status_code: 400, code: "VALIDATION_ERROR", message: "Invalid vendor_id" });
  }

  const vendor = await VendorModel.findById(body.vendor_id).lean();
  if (!vendor) {
    throw new ApiError({ status_code: 404, code: "NOT_FOUND", message: "Vendor not found" });
  }

  const payout = await PayoutModel.create({
    vendor_id: vendor._id,
    amount: body.amount,
    mode: body.mode,
    note: body.note ? body.note : null,
    status: "Draft",
    decision_reason: null,
  });

  await PayoutAuditModel.create({
    payout_id: payout._id,
    action: "CREATED",
    actor_user_id: new mongoose.Types.ObjectId(actor.id),
    actor_email: actor.email,
    actor_role: actor.role,
  });

  return payout.toObject();
}

export async function submit_payout_service(payout_id: string, actor: AuthUser) {
  if (!mongoose.isValidObjectId(payout_id)) {
    throw new ApiError({ status_code: 400, code: "VALIDATION_ERROR", message: "Invalid payout id" });
  }

  const payout = await PayoutModel.findById(payout_id);
  if (!payout) {
    throw new ApiError({ status_code: 404, code: "NOT_FOUND", message: "Payout not found" });
  }

  if (payout.status !== "Draft") {
    throw new ApiError({
      status_code: 409,
      code: "CONFLICT",
      message: "Only Draft payouts can be submitted",
    });
  }

  payout.status = "Submitted";
  payout.decision_reason = null;
  await payout.save();

  await PayoutAuditModel.create({
    payout_id: payout._id,
    action: "SUBMITTED",
    actor_user_id: new mongoose.Types.ObjectId(actor.id),
    actor_email: actor.email,
    actor_role: actor.role,
  });

  return payout.toObject();
}

export async function approve_payout_service(payout_id: string, actor: AuthUser) {
  if (!mongoose.isValidObjectId(payout_id)) {
    throw new ApiError({ status_code: 400, code: "VALIDATION_ERROR", message: "Invalid payout id" });
  }

  const payout = await PayoutModel.findById(payout_id);
  if (!payout) {
    throw new ApiError({ status_code: 404, code: "NOT_FOUND", message: "Payout not found" });
  }

  if (payout.status !== "Submitted") {
    throw new ApiError({
      status_code: 409,
      code: "CONFLICT",
      message: "Only Submitted payouts can be approved",
    });
  }

  payout.status = "Approved";
  payout.decision_reason = null;
  await payout.save();

  await PayoutAuditModel.create({
    payout_id: payout._id,
    action: "APPROVED",
    actor_user_id: new mongoose.Types.ObjectId(actor.id),
    actor_email: actor.email,
    actor_role: actor.role,
  });

  return payout.toObject();
}

export async function reject_payout_service(payout_id: string, reason: string, actor: AuthUser) {
  if (!mongoose.isValidObjectId(payout_id)) {
    throw new ApiError({ status_code: 400, code: "VALIDATION_ERROR", message: "Invalid payout id" });
  }

  const payout = await PayoutModel.findById(payout_id);
  if (!payout) {
    throw new ApiError({ status_code: 404, code: "NOT_FOUND", message: "Payout not found" });
  }

  if (payout.status !== "Submitted") {
    throw new ApiError({
      status_code: 409,
      code: "CONFLICT",
      message: "Only Submitted payouts can be rejected",
    });
  }

  payout.status = "Rejected";
  payout.decision_reason = reason;
  await payout.save();

  await PayoutAuditModel.create({
    payout_id: payout._id,
    action: "REJECTED",
    actor_user_id: new mongoose.Types.ObjectId(actor.id),
    actor_email: actor.email,
    actor_role: actor.role,
  });

  return payout.toObject();
}

export async function delete_payout_service(payout_id: string, actor: AuthUser) {
  if (!mongoose.isValidObjectId(payout_id)) {
    throw new ApiError({ status_code: 400, code: "VALIDATION_ERROR", message: "Invalid payout id" });
  }

  const payout = await PayoutModel.findById(payout_id);
  if (!payout) {
    throw new ApiError({ status_code: 404, code: "NOT_FOUND", message: "Payout not found" });
  }

  // Deletion is allowed only for Draft payouts (to keep state transitions consistent).
  if (payout.status !== "Draft") {
    throw new ApiError({
      status_code: 409,
      code: "CONFLICT",
      message: "Only Draft payouts can be deleted",
    });
  }

  await PayoutAuditModel.create({
    payout_id: payout._id,
    action: "DELETED",
    actor_user_id: new mongoose.Types.ObjectId(actor.id),
    actor_email: actor.email,
    actor_role: actor.role,
  });

  await PayoutModel.deleteOne({ _id: payout._id });
}

