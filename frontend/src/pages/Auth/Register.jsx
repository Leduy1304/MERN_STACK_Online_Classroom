import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { UserPlus, GraduationCap, Lock, Mail, User, Shield } from "lucide-react";

const Register = () => {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error("Vui lòng điền đầy đủ tất cả các trường");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Mật khẩu phải chứa ít nhất 6 ký tự");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    try {
      const data = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      toast.success("Đăng ký tài khoản thành công!");
      if (data.role === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/courses");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
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
          maxWidth: "480px",
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
            Đăng Ký Tài Khoản
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Bắt đầu trải nghiệm học tập và giảng dạy trực tuyến
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Họ và Tên</label>
            <div style={{ position: "relative" }}>
              <User
                size={18}
                color="var(--text-muted)"
                style={{ position: "absolute", left: "14px", top: "12px" }}
              />
              <input
                type="text"
                required
                className="form-control"
                style={{ paddingLeft: "42px" }}
                placeholder="Nguyễn Văn A"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          </div>

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
                placeholder="email@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Vai trò tham gia</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "student" })}
                style={{
                  padding: "12px",
                  borderRadius: "var(--radius-md)",
                  border: `2px solid ${
                    form.role === "student" ? "var(--primary)" : "var(--border)"
                  }`,
                  background:
                    form.role === "student" ? "var(--primary-light)" : "#ffffff",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color:
                    form.role === "student"
                      ? "var(--primary-dark)"
                      : "var(--text-main)",
                  cursor: "pointer",
                }}
              >
                Sinh viên (Student)
              </button>

              <button
                type="button"
                onClick={() => setForm({ ...form, role: "teacher" })}
                style={{
                  padding: "12px",
                  borderRadius: "var(--radius-md)",
                  border: `2px solid ${
                    form.role === "teacher" ? "var(--primary)" : "var(--border)"
                  }`,
                  background:
                    form.role === "teacher" ? "var(--primary-light)" : "#ffffff",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color:
                    form.role === "teacher"
                      ? "var(--primary-dark)"
                      : "var(--text-main)",
                  cursor: "pointer",
                }}
              >
                Giảng viên (Teacher)
              </button>
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
                placeholder="Tối thiểu 6 ký tự"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Xác nhận mật khẩu</label>
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
                placeholder="Nhập lại mật khẩu"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "10px" }}
          >
            <UserPlus size={18} />
            <span>{loading ? "Đang tạo tài khoản..." : "Hoàn tất đăng ký"}</span>
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
          Đã có tài khoản?{" "}
          <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
