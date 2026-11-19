const Submission = require("../models/Submission");
const Assignment = require("../models/Assignment");

// @desc    Submit assignment (text and/or file)
// @route   POST /api/submissions/:assignmentId
// @access  Private (Student)
const submitAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const { submissionText, fileUrl, fileName } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bài tập để nộp",
      });
    }

    if (!submissionText && !fileUrl) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập nội dung bài làm hoặc đính kèm tệp tin",
      });
    }

    // Check if user already submitted
    let submission = await Submission.findOne({
      assignment: assignmentId,
      student: req.user._id,
    });

    if (submission) {
      // If already graded, prevent overwriting
      if (submission.status === "graded") {
        return res.status(400).json({
          success: false,
          message: "Bài tập của bạn đã được chấm điểm, không thể nộp lại!",
        });
      }

      // Update existing submission
      if (submissionText !== undefined) submission.submissionText = submissionText;
      if (fileUrl !== undefined) submission.fileUrl = fileUrl;
      if (fileName !== undefined) submission.fileName = fileName;
      submission.submittedAt = Date.now();

      await submission.save();

      return res.json({
        success: true,
        message: "Cập nhật bài nộp thành công!",
        data: submission,
      });
    }

    submission = await Submission.create({
      assignment: assignmentId,
      course: assignment.course,
      student: req.user._id,
      submissionText: submissionText || "",
      fileUrl: fileUrl || "",
      fileName: fileName || "",
      submittedAt: Date.now(),
      status: "submitted",
    });

    res.status(201).json({
      success: true,
      message: "Nộp bài tập thành công!",
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all submissions for an assignment
// @route   GET /api/submissions/assignment/:assignmentId
// @access  Private (Teacher owner, Admin)
const getSubmissionsByAssignment = async (req, res, next) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await Assignment.findById(assignmentId);
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
        message: "Bạn không có quyền xem bài nộp của bài tập này",
      });
    }

    const submissions = await Submission.find({ assignment: assignmentId })
      .populate("student", "name email avatar")
      .populate("gradedBy", "name")
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Grade submission
// @route   PUT /api/submissions/:id/grade
// @access  Private (Teacher owner, Admin)
const gradeSubmission = async (req, res, next) => {
  try {
    const { score, feedback } = req.body;

    if (score === undefined || score === null) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập điểm số",
      });
    }

    const submission = await Submission.findById(req.params.id).populate(
      "assignment"
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bài nộp để chấm",
      });
    }

    if (
      req.user.role !== "admin" &&
      submission.assignment.teacher.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền chấm bài tập này",
      });
    }

    const maxScore = submission.assignment.maxScore || 10;
    const numScore = Number(score);

    if (isNaN(numScore) || numScore < 0 || numScore > maxScore) {
      return res.status(400).json({
        success: false,
        message: `Điểm số phải là số từ 0 đến ${maxScore}`,
      });
    }

    submission.score = numScore;
    submission.feedback = feedback !== undefined ? feedback : submission.feedback;
    submission.gradedBy = req.user._id;
    submission.gradedAt = Date.now();
    submission.status = "graded";

    await submission.save();

    res.json({
      success: true,
      message: "Chấm điểm bài tập thành công!",
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student's own submission for an assignment
// @route   GET /api/submissions/my/:assignmentId
// @access  Private (Student)
const getMySubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findOne({
      assignment: req.params.assignmentId,
      student: req.user._id,
    }).populate("gradedBy", "name email");

    res.json({
      success: true,
      data: submission || null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitAssignment,
  getSubmissionsByAssignment,
  gradeSubmission,
  getMySubmission,
};
