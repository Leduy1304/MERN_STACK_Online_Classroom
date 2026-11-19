const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate safe clean filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const basename = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    cb(null, `${basename}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  // Allow common study and submission file types
  const allowedExts = /jpeg|jpg|png|webp|gif|pdf|doc|docx|ppt|pptx|xls|xlsx|zip|rar|txt/;
  const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
  if (allowedExts.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Định dạng file không được hỗ trợ! Vui lòng chọn PDF, Word, Ảnh hoặc file nén zip/rar."));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
  fileFilter,
});

module.exports = upload;
