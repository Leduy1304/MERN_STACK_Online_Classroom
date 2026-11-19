const express = require("express");
const router = express.Router();
const {
  submitAssignment,
  getSubmissionsByAssignment,
  gradeSubmission,
  getMySubmission,
} = require("../controllers/submissionController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.post("/:assignmentId", protect, authorize("student", "admin"), submitAssignment);
router.get("/my/:assignmentId", protect, authorize("student", "admin"), getMySubmission);
router.get(
  "/assignment/:assignmentId",
  protect,
  authorize("teacher", "admin"),
  getSubmissionsByAssignment
);
router.put(
  "/:id/grade",
  protect,
  authorize("teacher", "admin"),
  gradeSubmission
);

module.exports = router;
