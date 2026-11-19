const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");

// @desc    Get all courses (with search & filter)
// @route   GET /api/courses
// @access  Public
const getAllCourses = async (req, res, next) => {
  try {
    const { keyword, category, level, teacher, status } = req.query;

    const query = {};

    // For public, show published courses only. Admin/teacher can request specific status.
    if (status) {
      query.status = status;
    } else {
      query.status = "published";
    }

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (level) {
      query.level = level;
    }

    if (teacher) {
      query.teacher = teacher;
    }

    const courses = await Course.find(query)
      .populate("category", "name slug")
      .populate("teacher", "name email avatar")
      .sort({ createdAt: -1 });

    // Attach enrolled student count to each course
    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const studentCount = await Enrollment.countDocuments({
          course: course._id,
        });
        const assignmentCount = await Assignment.countDocuments({
          course: course._id,
        });
        return {
          ...course.toObject(),
          studentCount,
          assignmentCount,
          materialCount: course.materials ? course.materials.length : 0,
        };
      })
    );

    res.json({
      success: true,
      count: coursesWithStats.length,
      data: coursesWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public (extra details if logged in)
const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("category", "name slug")
      .populate("teacher", "name email avatar bio");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khóa học",
      });
    }

    const studentCount = await Enrollment.countDocuments({ course: course._id });
    const assignments = await Assignment.find({ course: course._id }).sort({
      createdAt: -1,
    });

    let isEnrolled = false;
    let enrollmentData = null;

    if (req.user) {
      const enrollment = await Enrollment.findOne({
        course: course._id,
        student: req.user._id,
      });
      if (enrollment) {
        isEnrolled = true;
        enrollmentData = enrollment;
      }
    }

    res.json({
      success: true,
      data: {
        ...course.toObject(),
        studentCount,
        assignments,
        isEnrolled,
        enrollment: enrollmentData,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Teacher, Admin)
const createCourse = async (req, res, next) => {
  try {
    const { title, description, category, thumbnail, level, status } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ tiêu đề, mô tả và danh mục khóa học",
      });
    }

    const course = await Course.create({
      title,
      description,
      category,
      teacher: req.user._id,
      thumbnail:
        thumbnail ||
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60",
      level: level || "Cơ bản",
      status: status || "published",
      materials: [],
    });

    const populatedCourse = await Course.findById(course._id)
      .populate("category", "name")
      .populate("teacher", "name email");

    res.status(201).json({
      success: true,
      message: "Tạo khóa học thành công!",
      data: populatedCourse,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Teacher owner, Admin)
const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khóa học",
      });
    }

    // Check ownership unless admin
    if (
      req.user.role !== "admin" &&
      course.teacher.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền chỉnh sửa khóa học của người khác",
      });
    }

    const { title, description, category, thumbnail, level, status } = req.body;

    if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category;
    if (thumbnail) course.thumbnail = thumbnail;
    if (level) course.level = level;
    if (status) course.status = status;

    const updatedCourse = await course.save();

    res.json({
      success: true,
      message: "Cập nhật khóa học thành công",
      data: updatedCourse,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Teacher owner, Admin)
const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

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
        message: "Bạn không có quyền xóa khóa học của người khác",
      });
    }

    // Cascade delete enrollments, assignments, submissions
    await Enrollment.deleteMany({ course: course._id });
    await Assignment.deleteMany({ course: course._id });
    await Submission.deleteMany({ course: course._id });
    await course.deleteOne();

    res.json({
      success: true,
      message: "Đã xóa khóa học và toàn bộ dữ liệu liên quan thành công",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add material (PDF, Video link, Reading) to course
// @route   POST /api/courses/:id/materials
// @access  Private (Teacher owner, Admin)
const addMaterial = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
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
        message: "Bạn không có quyền thêm tài liệu vào khóa học này",
      });
    }

    const { title, type, fileUrl, videoUrl, content, duration } = req.body;

    if (!title || !type) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập tiêu đề và loại tài liệu (PDF, Video, Bài đọc)",
      });
    }

    const order = course.materials.length + 1;
    course.materials.push({
      title,
      type,
      fileUrl: fileUrl || "",
      videoUrl: videoUrl || "",
      content: content || "",
      duration: duration || "15 phút",
      order,
    });

    await course.save();

    res.status(201).json({
      success: true,
      message: "Thêm tài liệu/bài học thành công",
      data: course.materials,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update material in course
// @route   PUT /api/courses/:id/materials/:materialId
// @access  Private (Teacher owner, Admin)
const updateMaterial = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
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
        message: "Bạn không có quyền cập nhật tài liệu khóa học này",
      });
    }

    const material = course.materials.id(req.params.materialId);
    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bài học/tài liệu này",
      });
    }

    const { title, type, fileUrl, videoUrl, content, duration, order } = req.body;
    if (title) material.title = title;
    if (type) material.type = type;
    if (fileUrl !== undefined) material.fileUrl = fileUrl;
    if (videoUrl !== undefined) material.videoUrl = videoUrl;
    if (content !== undefined) material.content = content;
    if (duration !== undefined) material.duration = duration;
    if (order !== undefined) material.order = order;

    await course.save();

    res.json({
      success: true,
      message: "Cập nhật tài liệu thành công",
      data: material,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete material from course
// @route   DELETE /api/courses/:id/materials/:materialId
// @access  Private (Teacher owner, Admin)
const deleteMaterial = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
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
        message: "Bạn không có quyền xóa tài liệu của khóa học này",
      });
    }

    course.materials = course.materials.filter(
      (m) => m._id.toString() !== req.params.materialId
    );

    await course.save();

    res.json({
      success: true,
      message: "Xóa tài liệu bài học thành công",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get courses created by current teacher
// @route   GET /api/courses/teacher/my-courses
// @access  Private (Teacher, Admin)
const getMyTeachingCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ teacher: req.user._id })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    const coursesWithStats = await Promise.all(
      courses.map(async (c) => {
        const studentCount = await Enrollment.countDocuments({ course: c._id });
        const assignmentCount = await Assignment.countDocuments({ course: c._id });
        return {
          ...c.toObject(),
          studentCount,
          assignmentCount,
        };
      })
    );

    res.json({
      success: true,
      data: coursesWithStats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addMaterial,
  updateMaterial,
  deleteMaterial,
  getMyTeachingCourses,
};
