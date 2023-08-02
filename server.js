import mongoose from "mongoose";
import "dotenv/config";

import app from "./app.js";

//config Знаходить в проєкті файл .env, читає построково і додає ці дані в глобальний об'єкт process.env, те що зліва від дорівнює стає ключем, справа-значенням
// dotenv.config();

const { DB_HOST, PORT } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Database connection successful");
    });
  })
  .catch((error) => {
    console.log(error.message);
    // закриваємо всі запущені процеси:
    process.exit(1);
  });
