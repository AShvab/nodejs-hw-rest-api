import Joi from "joi";

import { emailRegexp } from "../constants/user-constants.js";

const userSignupSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  subscription: Joi.string().valid("starter", "pro", "business"),
});


const userSigninSchema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().pattern(emailRegexp).required(),
  });


  
  export default {
    userSignupSchema,
    userSigninSchema,
  }