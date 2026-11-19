const express = require("express");
const router = express.Router();
const {
  createAssignment,
  getAssignmentsByCourse,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
} = require("../controllers/assignmentController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.post("/", protect, authorize("teacher", "admin"), createAssignment);
router.get("/course/:courseId", protect, getAssignmentsByCourse);
router.get("/:id", protect, getAssignmentById);
router.put("/:id", protect, authorize("teacher", "admin"), updateAssignment);
router.delete("/:id", protect, authorize("teacher", "admin"), deleteAssignment);

module.exports = router;
