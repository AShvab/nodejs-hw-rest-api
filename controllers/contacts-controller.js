import Contact from "../models/contact.js";

import { ctrlWrapper } from "../decorators/index.js";

import { HttpError } from "../helpers/index.js";

const getAll = async (req, res) => {
  const result = await Contact.find();
  res.json(result);
};

// const getById = async (req, res) => {
//   const { contactId } = req.params;
//   const result = await contactsService.getContactById(contactId);
//   if (!result) {
//     throw HttpError(404, "Not found");
//   }
//   res.json(result);
// };

// const add = async (req, res) => {
//   const result = await contactsService.addContact(req.body);
//   res.status(201).json(result);
// };

// const updateById = async (req, res) => {
//   const { contactId } = req.params;
//   const result = await contactsService.updateContact(contactId, req.body);

//   if (!result) {
//     throw HttpError(404, "Not found");
//   }
//   res.json(result);
// };

// const removeById = async (req, res) => {
//   const { contactId } = req.params;
//   const result = await contactsService.removeContact(contactId);
//   if (!result) {
//     throw HttpError(404, "Not found");
//   }
//   res.json({
//     message: "contact deleted",
//   });
// };

export default {
  getAll: ctrlWrapper(getAll),
  // getById: ctrlWrapper(getById),
  // add: ctrlWrapper(add),
  // updateById: ctrlWrapper(updateById),
  // removeById: ctrlWrapper(removeById),
};
