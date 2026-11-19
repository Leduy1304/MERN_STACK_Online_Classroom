const express = require("express");
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addMaterial,
  updateMaterial,
  deleteMaterial,
  getMyTeachingCourses,
} = require("../controllers/courseController");
const { protect, optionalAuth, authorize } = require("../middlewares/authMiddleware");

// Teacher specific
router.get(
  "/teacher/my-courses",
  protect,
  authorize("teacher", "admin"),
  getMyTeachingCourses
);

// Course CRUD
router.get("/", getAllCourses);
router.get("/:id", optionalAuth, getCourseById);
router.post("/", protect, authorize("teacher", "admin"), createCourse);
router.put("/:id", protect, authorize("teacher", "admin"), updateCourse);
router.delete("/:id", protect, authorize("teacher", "admin"), deleteCourse);

// Course Materials CRUD
router.post(
  "/:id/materials",
  protect,
  authorize("teacher", "admin"),
  addMaterial
);
router.put(
  "/:id/materials/:materialId",
  protect,
  authorize("teacher", "admin"),
  updateMaterial
);
router.delete(
  "/:id/materials/:materialId",
  protect,
  authorize("teacher", "admin"),
  deleteMaterial
);

module.exports = router;
