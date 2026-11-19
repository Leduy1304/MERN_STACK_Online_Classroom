import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { LogIn, GraduationCap, Lock, Mail, Sparkles } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    setLoading(true);
    try {
      const data = await login(email, password);
      toast.success(`Chào mừng ${data.name}! Đăng nhập thành công.`);

      // Redirect based on role or location state
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from);
      } else if (data.role === "admin") {
        navigate("/admin");
      } else if (data.role === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/my-courses");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 180px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "460px",
          padding: "36px",
          boxShadow: "var(--shadow-xl)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "var(--primary)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 14px auto",
            }}
          >
            <GraduationCap size={32} />
          </div>
          <h2 style={{ fontSize: "1.6rem", marginBottom: "6px" }}>
            Đăng nhập Hệ thống
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Nền tảng Lớp học Trực tuyến EduLearn
          </p>
        </div>

        {/* Quick Demo Fill Buttons */}
        <div
          style={{
            background: "var(--bg-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "12px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              color: "var(--text-muted)",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Sparkles size={14} color="#f59e0b" />
            <span>Tài khoản mẫu để kiểm thử:</span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            <button
              type="button"
              onClick={() => handleFillDemo("admin@classroom.edu.vn", "password123")}
              className="badge badge-danger"
              style={{ cursor: "pointer", border: "none" }}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo("teacher1@classroom.edu.vn", "password123")}
              className="badge badge-primary"
              style={{ cursor: "pointer", border: "none" }}
            >
              Giảng viên (TS. An)
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo("student1@classroom.edu.vn", "password123")}
              className="badge badge-success"
              style={{ cursor: "pointer", border: "none" }}
            >
              Sinh viên (Lê Nam)
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo("blocked@classroom.edu.vn", "password123")}
              className="badge badge-gray"
              title="Tài khoản này đã bị admin khóa để test thông báo lỗi bảo mật"
              style={{ cursor: "pointer", border: "none" }}
            >
              Tk bị khóa (Test lỗi)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Địa chỉ Email</label>
            <div style={{ position: "relative" }}>
              <Mail
                size={18}
                color="var(--text-muted)"
                style={{ position: "absolute", left: "14px", top: "12px" }}
              />
              <input
                type="email"
                required
                className="form-control"
                style={{ paddingLeft: "42px" }}
                placeholder="email@classroom.edu.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <div style={{ position: "relative" }}>
              <Lock
                size={18}
                color="var(--text-muted)"
                style={{ position: "absolute", left: "14px", top: "12px" }}
              />
              <input
                type="password"
                required
                className="form-control"
                style={{ paddingLeft: "42px" }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "10px" }}
          >
            <LogIn size={18} />
            <span>{loading ? "Đang xử lý..." : "Đăng nhập"}</span>
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "0.9rem",
            color: "var(--text-muted)",
          }}
        >
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            style={{ color: "var(--primary)", fontWeight: 600 }}
          >
            Đăng ký tham gia ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
