import { Schema, model } from "mongoose";

import { handleSaveError, validateAtUpdate } from "./hooks.js";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

// Перед тим, як знайти по id та оновити,треба зробити валідацію:
contactSchema.pre("findOneAndUpdate", validateAtUpdate);

// Якщо під час збереження сталася помилка, треба виконати функцію, якщо помилка не сталась, то функція не виконується
contactSchema.post("save", handleSaveError);
contactSchema.post("findOneAndUpdate", handleSaveError);

const Contact = model("contact", contactSchema);

export default Contact;
