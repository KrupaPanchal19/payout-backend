import mongoose, { Schema } from "mongoose";
import type { PayoutAuditAction } from "../types/domain_types";

export interface PayoutAuditDoc {
  _id: mongoose.Types.ObjectId;
  payout_id: mongoose.Types.ObjectId;
  action: PayoutAuditAction;
  actor_user_id: mongoose.Types.ObjectId;
  actor_email: string;
  actor_role: string;
  createdAt: Date;
  updatedAt: Date;
}

const payout_audit_schema = new Schema<PayoutAuditDoc>(
  {
    payout_id: { type: Schema.Types.ObjectId, required: true, ref: "Payout", index: true },
    action: { type: String, required: true, enum: ["CREATED", "SUBMITTED", "APPROVED", "REJECTED", "DELETED"] },
    actor_user_id: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    actor_email: { type: String, required: true },
    actor_role: { type: String, required: true },
  },
  { timestamps: true, collection: "payout_audits" },
);

export const PayoutAuditModel =
  (mongoose.models.PayoutAudit as mongoose.Model<PayoutAuditDoc>) ??
  mongoose.model<PayoutAuditDoc>("PayoutAudit", payout_audit_schema);

