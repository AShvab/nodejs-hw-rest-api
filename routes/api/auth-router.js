import express from "express";

import authController from "../../controllers/auth-controller.js";
import { validateBody } from "../../decorators/index.js";

import usersSchemas from "../../schemas/users-schemas.js";
import { authenticate, isEmptyVerifyBody,  upload } from "../../middlewars/index.js";


const authRouter = express.Router();

// створюємо маршрут, пишемо перевірку по Joi, додаємо контроллер
authRouter.post("/register", validateBody(usersSchemas.userSignupSchema), authController.signup);

authRouter.get("/verify/:verificationToken", authController.verify);

authRouter.post("/verify", isEmptyVerifyBody, validateBody(usersSchemas.userEmailSchema), authController.resendVerifyEmail);

authRouter.post(
  "/login", validateBody(usersSchemas.userSigninSchema), authController.signin);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.signout);


authRouter.patch("/", authenticate, validateBody(usersSchemas.updateUserSubscriptionSchema), authController.updateUserSubscription);

// upload.fields([{name:"avatar, maxCount:1}]) - очікуємо файли в кількох полях
// upload.array("avatar", 8) - очікуємо в одному полі 8 файлів
// upload.single("avatar") в полі аватар очікуємо один файл
authRouter.patch("/avatars", authenticate, upload.single("avatar"), authController.avatarUpdate);

export default authRouter;
