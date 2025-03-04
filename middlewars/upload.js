import multer from "multer";
import path from "path";

// destination - шлях до тимчасової папки
const destination = path.resolve("temp");

const storage = multer.diskStorage({
  destination,
  // filename-під яким ім'ям файл зберігати, null-помилки немає
  filename: (req, file, cb) => {
    const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniquePrefix}_${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
});

export default upload;
