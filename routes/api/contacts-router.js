import express from "express";

import contactsController from "../../controllers/contacts-controller.js";

import contactsSchemas from "../../schemas/contacts-schemas.js";

import {validateBody} from "../../decorators/index.js";

import {authenticate, upload, isEmptyBody, isEmptyBodyFavorite, isValidId} from "../../middlewars/index.js";

const contactsRouter = express.Router();

// запис, якщо для кожного маршруту потрібно застосувати middleware:
contactsRouter.use(authenticate);

contactsRouter.get("/", contactsController.getAll);

contactsRouter.get("/:contactId", isValidId, contactsController.getById);

// upload.fields([{name:"avatar, maxCount:1}])
// upload.array("avatar", 8)
contactsRouter.post("/", upload.single("avatar"), isEmptyBody, validateBody(contactsSchemas.contactsAddSchema), contactsController.add);

contactsRouter.put("/:contactId", isValidId, isEmptyBody, validateBody(contactsSchemas.contactsAddSchema),contactsController.updateById);

contactsRouter.patch("/:contactId/favorite", isValidId, isEmptyBodyFavorite, validateBody(contactsSchemas.contactUpdateFavoriteSchema), contactsController.updateFavorite);

contactsRouter.delete("/:contactId", isValidId, contactsController.removeById);

export default contactsRouter;
