import Joi from "joi";

export const login_body_schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(3).required(),
});

