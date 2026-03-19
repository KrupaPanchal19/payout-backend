import type { Request, Response } from "express";
import { create_vendor_service, delete_vendor_service, get_vendor_by_id_service, list_vendors_service, update_vendor_by_id_service } from "../services/vendor_service";
import { general_response } from "../utils/general_response";

export async function list_vendors_controller(_req: Request, res: Response) {
  const vendors = await list_vendors_service();
  return general_response(res, { message: "Vendors fetched", data: vendors });
}

export async function create_vendor_controller(req: Request, res: Response) {
  const vendor = await create_vendor_service(req.body);
  return general_response(res, { status_code: 201, message: "Vendor created", data: vendor });
}
export async function get_vendor_by_id_controller(req: Request, res: Response) {
  const vendor = await get_vendor_by_id_service(req.params.id as string);
  return general_response(res, { status_code: 201, message: "Vendor created", data: vendor });
}

export async function update_vendor_by_id_controller(req: Request, res: Response) {
  const vendor = await update_vendor_by_id_service(req.params.id as string,req.body);
  return general_response(res, { status_code: 201, message: "Vendor created", data: vendor });
}
export async function delete_vendor_controller(req: Request, res: Response) {
  const vendor = await delete_vendor_service(req.params.id as string);
  return general_response(res, { message: "Vendor deleted", data: vendor });
}

