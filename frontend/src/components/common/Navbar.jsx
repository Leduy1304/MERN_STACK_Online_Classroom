import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  GraduationCap,
  BookOpen,
  LayoutDashboard,
  ShieldCheck,
  UserCheck,
  LogOut,
  User,
  ChevronDown,
  Sparkles,
} from "lucide-react";

const Navbar = () => {
  const { user, isAuthenticated, logout, login, isAdmin, isTeacher, isStudent } =
    useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info("Đã đăng xuất thành công");
    setDropdownOpen(false);
    navigate("/");
  };

  const handleQuickLogin = async (email, password, roleName) => {
    try {
      await login(email, password);
      toast.success(`Đã chuyển đổi sang tài khoản: ${roleName}`);
      setDemoMenuOpen(false);
      navigate(
        roleName.includes("Admin")
          ? "/admin"
          : roleName.includes("Giảng viên")
          ? "/teacher"
          : "/my-courses"
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <nav
      style={{
        background: "#ffffff",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "70px",
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: 800,
            fontSize: "1.3rem",
            color: "var(--primary)",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "var(--primary)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GraduationCap size={24} />
          </div>
          <span>EduLearn</span>
        </Link>

        {/* Center Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <Link
            to="/courses"
            style={{
              fontWeight: 600,
              color: "var(--text-main)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <BookOpen size={18} color="var(--primary)" />
            <span>Khóa học</span>
          </Link>

          {isAuthenticated && isStudent && (
            <Link
              to="/my-courses"
              style={{
                fontWeight: 600,
                color: "var(--text-main)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <GraduationCap size={18} color="var(--primary)" />
              <span>Khóa học của tôi</span>
            </Link>
          )}

          {isAuthenticated && isTeacher && (
            <Link
              to="/teacher"
              style={{
                fontWeight: 600,
                color: "var(--text-main)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <LayoutDashboard size={18} color="var(--primary)" />
              <span>Giảng dạy</span>
            </Link>
          )}

          {isAuthenticated && isAdmin && (
            <Link
              to="/admin"
              style={{
                fontWeight: 600,
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <ShieldCheck size={18} color="var(--primary)" />
              <span>Quản trị Hệ thống</span>
            </Link>
          )}
        </div>

        {/* Right Section: Quick Switch & User Info */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {/* Quick Demo Switcher Button */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setDemoMenuOpen(!demoMenuOpen)}
              className="btn btn-secondary btn-sm"
              title="Chuyển nhanh giữa các vai trò để kiểm thử"
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <Sparkles size={16} />
              <span>Demo Role</span>
            </button>

            {demoMenuOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "40px",
                  background: "#ffffff",
                  boxShadow: "var(--shadow-xl)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  width: "240px",
                  padding: "8px",
                  zIndex: 100,
                }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    padding: "6px 8px",
                    textTransform: "uppercase",
                  }}
                >
                  Đăng nhập nhanh (1-Click)
                </div>
                <button
                  onClick={() =>
                    handleQuickLogin(
                      "admin@classroom.edu.vn",
                      "password123",
                      "Admin (Quản trị viên)"
                    )
                  }
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 10px",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--bg-subtle)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <span className="badge badge-danger">Admin</span>
                  <span>Quản trị viên</span>
                </button>
                <button
                  onClick={() =>
                    handleQuickLogin(
                      "teacher1@classroom.edu.vn",
                      "password123",
                      "Giảng viên (TS. An)"
                    )
                  }
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 10px",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--bg-subtle)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <span className="badge badge-primary">Teacher</span>
                  <span>TS. Nguyễn Văn An</span>
                </button>
                <button
                  onClick={() =>
                    handleQuickLogin(
                      "student1@classroom.edu.vn",
                      "password123",
                      "Sinh viên (Lê Nam)"
                    )
                  }
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 10px",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--bg-subtle)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <span className="badge badge-success">Student</span>
                  <span>Lê Hoàng Nam</span>
                </button>
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "6px 12px",
                  borderRadius: "var(--radius-full)",
                  background: "var(--bg-subtle)",
                }}
              >
                <img
                  src={
                    user?.avatar ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                  }
                  alt={user?.name}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <div style={{ textAlign: "left" }}>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      maxWidth: "110px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {user?.name}
                  </div>
                  <span
                    className={`badge ${
                      user?.role === "admin"
                        ? "badge-danger"
                        : user?.role === "teacher"
                        ? "badge-primary"
                        : "badge-success"
                    }`}
                    style={{ fontSize: "0.65rem", padding: "1px 6px" }}
                  >
                    {user?.role === "admin"
                      ? "Admin"
                      : user?.role === "teacher"
                      ? "Giảng viên"
                      : "Sinh viên"}
                  </span>
                </div>
                <ChevronDown size={14} color="var(--text-muted)" />
              </button>

              {dropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "52px",
                    background: "#ffffff",
                    boxShadow: "var(--shadow-xl)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    width: "190px",
                    padding: "8px",
                    zIndex: 100,
                  }}
                >
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      fontSize: "0.88rem",
                      color: "var(--text-main)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--bg-subtle)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <User size={16} />
                    <span>Hồ sơ cá nhân</span>
                  </Link>
                  <div
                    style={{
                      height: "1px",
                      background: "var(--border)",
                      margin: "4px 0",
                    }}
                  />
                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      fontSize: "0.88rem",
                      color: "var(--danger)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--danger-light)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <LogOut size={16} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Đăng nhập
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
