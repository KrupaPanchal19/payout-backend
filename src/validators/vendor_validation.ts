import Joi from "joi";

export const create_vendor_body_schema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  upi_id: Joi.string().trim().allow(null, "").optional(),
  bank_account: Joi.string().trim().allow(null, "").optional(),
  ifsc: Joi.string().trim().allow(null, "").optional(),
  is_active: Joi.boolean().optional(),
});

