const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const { protect } = require("../middlewares/authMiddleware");

// @desc    Upload a single file (PDF, doc, img, zip...)
// @route   POST /api/upload
// @access  Private
router.post("/", protect, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng chọn một tệp tin để tải lên",
    });
  }

  // Construct URL
  const fileUrl = `/uploads/${req.file.filename}`;

  res.json({
    success: true,
    message: "Tải file lên máy chủ thành công!",
    data: {
      url: fileUrl,
      fileName: req.file.originalname,
      storedName: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    },
  });
});

module.exports = router;
