const Assignment = require("../models/Assignment");
const Course = require("../models/Course");
const Submission = require("../models/Submission");

// @desc    Create new assignment
// @route   POST /api/assignments
// @access  Private (Teacher, Admin)
const createAssignment = async (req, res, next) => {
  try {
    const { courseId, title, description, deadline, maxScore, attachmentUrl } =
      req.body;

    if (!courseId || !title || !description || !deadline) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ: Khóa học, tiêu đề, mô tả và hạn nộp",
      });
    }

    const course = await Course.findById(courseId);
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
        message: "Bạn không thể tạo bài tập cho khóa học của người khác",
      });
    }

    const assignment = await Assignment.create({
      course: courseId,
      teacher: req.user._id,
      title,
      description,
      deadline,
      maxScore: maxScore || 10,
      attachmentUrl: attachmentUrl || "",
    });

    res.status(201).json({
      success: true,
      message: "Tạo bài tập thành công!",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get assignments for a course
// @route   GET /api/assignments/course/:courseId
// @access  Private (Logged in users)
const getAssignmentsByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const assignments = await Assignment.find({ course: courseId })
      .populate("teacher", "name email avatar")
      .sort({ deadline: 1 });

    // If user is a student, attach their submission info
    const assignmentsWithSubmission = await Promise.all(
      assignments.map(async (assignment) => {
        let submission = null;
        let submissionCount = 0;

        if (req.user && req.user.role === "student") {
          submission = await Submission.findOne({
            assignment: assignment._id,
            student: req.user._id,
          });
        }

        if (req.user && (req.user.role === "teacher" || req.user.role === "admin")) {
          submissionCount = await Submission.countDocuments({
            assignment: assignment._id,
          });
        }

        return {
          ...assignment.toObject(),
          mySubmission: submission,
          submissionCount,
        };
      })
    );

    res.json({
      success: true,
      count: assignmentsWithSubmission.length,
      data: assignmentsWithSubmission,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get assignment by ID
// @route   GET /api/assignments/:id
// @access  Private
const getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate("course", "title teacher")
      .populate("teacher", "name email");

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bài tập",
      });
    }

    let mySubmission = null;
    if (req.user && req.user.role === "student") {
      mySubmission = await Submission.findOne({
        assignment: assignment._id,
        student: req.user._id,
      });
    }

    res.json({
      success: true,
      data: {
        ...assignment.toObject(),
        mySubmission,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update assignment
// @route   PUT /api/assignments/:id
// @access  Private (Teacher owner, Admin)
const updateAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bài tập",
      });
    }

    if (
      req.user.role !== "admin" &&
      assignment.teacher.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền chỉnh sửa bài tập này",
      });
    }

    const { title, description, deadline, maxScore, attachmentUrl } = req.body;
    if (title) assignment.title = title;
    if (description) assignment.description = description;
    if (deadline) assignment.deadline = deadline;
    if (maxScore !== undefined) assignment.maxScore = maxScore;
    if (attachmentUrl !== undefined) assignment.attachmentUrl = attachmentUrl;

    const updated = await assignment.save();

    res.json({
      success: true,
      message: "Cập nhật bài tập thành công",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Private (Teacher owner, Admin)
const deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bài tập",
      });
    }

    if (
      req.user.role !== "admin" &&
      assignment.teacher.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xóa bài tập này",
      });
    }

    await Submission.deleteMany({ assignment: assignment._id });
    await assignment.deleteOne();

    res.json({
      success: true,
      message: "Đã xóa bài tập và các bài nộp liên quan",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAssignment,
  getAssignmentsByCourse,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
};
