const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "supersecretkey_online_classroom_2026_ptudweb"
      );

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Người dùng không tồn tại hoặc đã bị xóa",
        });
      }

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: "Tài khoản của bạn đã bị vô hiệu hóa/khóa bởi Quản trị viên.",
        });
      }

      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Vui lòng đăng nhập để truy cập tài nguyên này",
    });
  }
};

const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "supersecretkey_online_classroom_2026_ptudweb"
      );
      const user = await User.findById(decoded.id).select("-password");
      if (user && user.isActive) {
        req.user = user;
      }
    } catch (err) {
      // Ignore token verification errors for optional auth
    }
  }
  next();
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Quyền truy cập bị từ chối: vai trò [${
          req.user ? req.user.role : "Khách"
        }] không được phép thực hiện`,
      });
    }
    next();
  };
};

module.exports = { protect, optionalAuth, authorize };
