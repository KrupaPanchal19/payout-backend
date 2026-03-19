import { VendorModel } from "../models/vendor_model";

export async function list_vendors_service() {
  // Only return active vendors (delete API soft-deactivates via `is_active: false`).
  return VendorModel.find({ is_active: true }).sort({ createdAt: -1 }).lean();
}

export async function create_vendor_service(body: {
  name: string;
  upi_id?: string | null;
  bank_account?: string | null;
  ifsc?: string | null;
  is_active?: boolean;
}) {
  const vendor = await VendorModel.create({
    name: body.name,
    upi_id: body.upi_id ? body.upi_id : null,
    bank_account: body.bank_account ? body.bank_account : null,
    ifsc: body.ifsc ? body.ifsc : null,
    is_active: body.is_active ?? true,
  });
  return vendor.toObject();
}

export async function get_vendor_by_id_service(id: string) {
  return VendorModel.findById(id).lean();
}

export async function update_vendor_by_id_service(id: string, body: {
  name: string;
  upi_id?: string | null;
  bank_account?: string | null;
  ifsc?: string | null;
  is_active?: boolean;
}) {
  return VendorModel.findByIdAndUpdate(id, body, { new: true }).lean();
}
export async function delete_vendor_service(id: string) {
  // Soft-delete by marking vendor inactive. This prevents breaking payout references.
  // If you want hard delete instead, tell me and I'll switch to `deleteOne()`.
  const vendor = await VendorModel.findByIdAndUpdate(
    id,
    { $set: { is_active: false } },
    { new: true },
  ).lean();

  if (!vendor) return null;
  return vendor;
}

