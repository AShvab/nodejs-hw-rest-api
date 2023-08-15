import Joi from "joi";

import { emailRegexp } from "../constants/user-constants.js";

const userSignupSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    "any.required": "missing required password field",
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": "missing required email field",
  }),
  subscription: Joi.string().valid("starter", "pro", "business"),
});


const userSigninSchema = Joi.object({
  password: Joi.string().required().messages({
    "any.required": "missing required password field",
  }),
  email: Joi.string().required().messages({
    "any.required": "missing required email field",
  }),
  });

  const updateUserSubscriptionSchema = Joi.object({
    subscription: Joi.string().valid('starter', 'pro', 'business').required().messages({
      'any.required': 'missing required subscription field'}),
  });

  const userEmailSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    });
  
  export default {
    userSignupSchema,
    userSigninSchema,
    updateUserSubscriptionSchema,
    userEmailSchema,
  }