import express from "express";

import authController from "../../controllers/auth-controller.js";

import { validateBody } from "../../decorators/index.js";

import usersSchemas from "../../schemas/users-schemas.js";

import { authenticate } from "../../middlewars/index.js";

const authRouter = express.Router();

// створюємо маршрут, пишемо перевірку по Joi, додаємо контроллер
authRouter.post(
  "/register",
  validateBody(usersSchemas.userSignupSchema),
  authController.signup
);

authRouter.post(
  "/login",
  validateBody(usersSchemas.userSigninSchema),
  authController.signin
);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.signout);

authRouter.patch("/", authenticate, validateBody(usersSchemas.updateUserSubscriptionSchema), authController.updateUserSubscription)

export default authRouter;
