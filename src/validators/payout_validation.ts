import Joi from "joi";

export const create_payout_body_schema = Joi.object({
  vendor_id: Joi.string().required(),
  amount: Joi.number().greater(0).required(),
  mode: Joi.string().valid("UPI", "IMPS", "NEFT").required(),
  note: Joi.string().trim().allow(null, "").optional(),
});

export const reject_payout_body_schema = Joi.object({
  reason: Joi.string().trim().min(1).required(),
});

