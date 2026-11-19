const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const Category = require("../models/Category");

// @desc    Get system dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalTeachers,
      totalCourses,
      totalEnrollments,
      totalAssignments,
      totalSubmissions,
      totalCategories,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "teacher" }),
      Course.countDocuments(),
      Enrollment.countDocuments(),
      Assignment.countDocuments(),
      Submission.countDocuments(),
      Category.countDocuments(),
    ]);

    // Recent 5 users
    const recentUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent 5 courses
    const recentCourses = await Course.find()
      .populate("teacher", "name email")
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalStudents,
          totalTeachers,
          totalCourses,
          totalEnrollments,
          totalAssignments,
          totalSubmissions,
          totalCategories,
        },
        recentUsers,
        recentCourses,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (search, role, status filters)
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const { keyword, role, status } = req.query;
    const query = {};

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ];
    }

    if (role) {
      query.role = role;
    }

    if (status !== undefined && status !== "") {
      query.isActive = status === "active" || status === "true";
    }

    const users = await User.find(query).select("-password").sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lock / Unlock user account
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private (Admin)
const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Bạn không thể tự khóa tài khoản của chính mình!",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: user.isActive
        ? `Đã mở khóa tài khoản cho [${user.name}]`
        : `Đã khóa tài khoản của [${user.name}]`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin)
const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["admin", "teacher", "student"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Vai trò không hợp lệ (chỉ chấp nhận admin, teacher, student)",
      });
    }

    if (id === req.user._id.toString() && role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "Bạn không thể tự hạ quyền quản trị viên của chính mình!",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: `Đã cập nhật vai trò của [${user.name}] thành [${role}]`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Bạn không thể tự xóa tài khoản của chính mình!",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    // Clean up user's data
    await Enrollment.deleteMany({ student: user._id });
    await Submission.deleteMany({ student: user._id });
    if (user.role === "teacher") {
      await Course.deleteMany({ teacher: user._id });
      await Assignment.deleteMany({ teacher: user._id });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: "Đã xóa người dùng thành công",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  updateUserRole,
  deleteUser,
};
