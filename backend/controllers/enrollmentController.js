const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

// @desc    Enroll into a course
// @route   POST /api/enrollments/:courseId
// @access  Private (Student)
const enrollCourse = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khóa học để ghi danh",
      });
    }

    // Check if already enrolled
    const existing = await Enrollment.findOne({
      course: courseId,
      student: req.user._id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã ghi danh khóa học này rồi!",
        data: existing,
      });
    }

    const enrollment = await Enrollment.create({
      course: courseId,
      student: req.user._id,
      progress: 0,
      completedMaterials: [],
    });

    res.status(201).json({
      success: true,
      message: "Ghi danh khóa học thành công! Chúc bạn học tốt.",
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get courses enrolled by current student
// @route   GET /api/enrollments/my-courses
// @access  Private (Student)
const getMyEnrolledCourses = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: "course",
        populate: [
          { path: "teacher", select: "name email avatar" },
          { path: "category", select: "name slug" },
        ],
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check enrollment status for a course
// @route   GET /api/enrollments/check/:courseId
// @access  Private
const checkEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({
      course: req.params.courseId,
      student: req.user._id,
    });

    res.json({
      success: true,
      isEnrolled: !!enrollment,
      data: enrollment || null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update learning progress (mark material completed)
// @route   PUT /api/enrollments/:courseId/progress
// @access  Private (Student)
const updateProgress = async (req, res, next) => {
  try {
    const { materialId } = req.body;
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      course: courseId,
      student: req.user._id,
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Bạn chưa ghi danh khóa học này",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khóa học",
      });
    }

    const totalMaterials = course.materials ? course.materials.length : 0;

    // Toggle completion of material
    const alreadyCompleted = enrollment.completedMaterials.some(
      (id) => id.toString() === materialId
    );

    if (alreadyCompleted) {
      enrollment.completedMaterials = enrollment.completedMaterials.filter(
        (id) => id.toString() !== materialId
      );
    } else {
      enrollment.completedMaterials.push(materialId);
    }

    if (totalMaterials > 0) {
      enrollment.progress = Math.round(
        (enrollment.completedMaterials.length / totalMaterials) * 100
      );
      if (enrollment.progress >= 100) {
        enrollment.status = "completed";
      } else {
        enrollment.status = "active";
      }
    }

    await enrollment.save();

    res.json({
      success: true,
      message: alreadyCompleted
        ? "Đã đánh dấu chưa hoàn thành bài học"
        : "Đã ghi nhận hoàn thành bài học!",
      data: enrollment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get enrolled students in a course (for teacher/admin)
// @route   GET /api/enrollments/course/:courseId/students
// @access  Private (Teacher owner, Admin)
const getCourseStudents = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khóa học",
      });
    }

    if (
      req.user.role !== "admin" &&
      course.teacher.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xem danh sách sinh viên khóa học này",
      });
    }

    const enrollments = await Enrollment.find({ course: req.params.courseId })
      .populate("student", "name email avatar phone createdAt")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  enrollCourse,
  getMyEnrolledCourses,
  checkEnrollment,
  updateProgress,
  getCourseStudents,
};
