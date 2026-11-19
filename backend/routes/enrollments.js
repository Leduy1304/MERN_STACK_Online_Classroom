const express = require("express");
const router = express.Router();
const {
  enrollCourse,
  getMyEnrolledCourses,
  checkEnrollment,
  updateProgress,
  getCourseStudents,
} = require("../controllers/enrollmentController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/my-courses", protect, authorize("student", "admin"), getMyEnrolledCourses);
router.get("/check/:courseId", protect, checkEnrollment);
router.post("/:courseId", protect, authorize("student", "admin"), enrollCourse);
router.put("/:courseId/progress", protect, authorize("student", "admin"), updateProgress);
router.get(
  "/course/:courseId/students",
  protect,
  authorize("teacher", "admin"),
  getCourseStudents
);

module.exports = router;
