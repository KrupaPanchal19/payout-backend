import mongoose, { Schema } from "mongoose";

export interface VendorDoc {
  _id: mongoose.Types.ObjectId;
  name: string;
  upi_id?: string | null;
  bank_account?: string | null;
  ifsc?: string | null;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const vendor_schema = new Schema<VendorDoc>(
  {
    name: { type: String, required: true, trim: true },
    upi_id: { type: String, required: false, default: null, trim: true },
    bank_account: { type: String, required: false, default: null, trim: true },
    ifsc: { type: String, required: false, default: null, trim: true },
    is_active: { type: Boolean, required: true, default: true },
  },
  { timestamps: true, collection: "vendors" },
);

export const VendorModel =
  (mongoose.models.Vendor as mongoose.Model<VendorDoc>) ??
  mongoose.model<VendorDoc>("Vendor", vendor_schema);

