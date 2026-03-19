import mongoose, { Schema } from "mongoose";
import type { PayoutMode, PayoutStatus } from "../types/domain_types";

export interface PayoutDoc {
  _id: mongoose.Types.ObjectId;
  vendor_id: mongoose.Types.ObjectId;
  amount: number;
  mode: PayoutMode;
  note?: string | null;
  status: PayoutStatus;
  decision_reason?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const payout_schema = new Schema<PayoutDoc>(
  {
    vendor_id: { type: Schema.Types.ObjectId, required: true, ref: "Vendor", index: true },
    amount: { type: Number, required: true, min: 0 },
    mode: { type: String, required: true, enum: ["UPI", "IMPS", "NEFT"] },
    note: { type: String, required: false, default: null, trim: true },
    status: {
      type: String,
      required: true,
      enum: ["Draft", "Submitted", "Approved", "Rejected"],
      default: "Draft",
      index: true,
    },
    decision_reason: { type: String, required: false, default: null, trim: true },
  },
  { timestamps: true, collection: "payouts" },
);

export const PayoutModel =
  (mongoose.models.Payout as mongoose.Model<PayoutDoc>) ??
  mongoose.model<PayoutDoc>("Payout", payout_schema);

