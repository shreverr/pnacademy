import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuid } from "uuid";


const tempStorageDir = './temp';

// Ensure the temp directory exists
fs.mkdirSync(tempStorageDir, { recursive: true });

const storage = multer.diskStorage({
  destination: tempStorageDir,
  filename: (req, file, cb) => {
    cb(null, uuid() + path.extname(file.originalname));
  }
});

export const upload = multer({ storage: storage });
