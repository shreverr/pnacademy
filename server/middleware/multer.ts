import multer from "multer";
import path from "path";
import { nanoid } from "nanoid";
import { AppError } from "../lib/appError";


const tempStorageDir = process.env.TEMP_DIR;
if (!tempStorageDir) {
  throw new AppError(
    "environment variable not set",
    500,
    "TEMP_DIR not set",
    false
  );
}

const maxSize = 1024 * 1024 * 1024; // 1GB

const storage = multer.diskStorage({
  destination: tempStorageDir,
  filename: (req, file, cb) => {
    cb(null, nanoid(5) + '-uploaded-data' + path.extname(file.originalname));
  }
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
});
