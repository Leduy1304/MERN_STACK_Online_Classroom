import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { authAPI } from "../../services/api";
import { User, Lock, Save, KeyRound } from "lucide-react";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState("info"); // info | password

  // Info form
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [savingInfo, setSavingInfo] = useState(false);

  // Password form
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setBio(user.bio || "");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingInfo(true);
    try {
      const res = await authAPI.updateProfile({ name, phone, bio, avatar });
      if (res.success) {
        updateUser(res.data);
        toast.success("Cập nhật thông tin hồ sơ thành công!");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingInfo(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới tối thiểu 6 ký tự");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("Xác nhận mật khẩu mới không khớp");
      return;
    }

    setSavingPassword(true);
    try {
      const res = await authAPI.changePassword({ oldPassword, newPassword });
      if (res.success) {
        toast.success("Đổi mật khẩu thành công!");
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: "40px" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "6px" }}>
            Hồ Sơ Cá Nhân
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            Quản lý thông tin tài khoản và cập nhật bảo mật mật khẩu của bạn.
          </p>
        </div>

        <div className="card" style={{ padding: "30px" }}>
          <div
            style={{
              display: "flex",
              gap: "16px",
              borderBottom: "1px solid var(--border)",
              marginBottom: "24px",
            }}
          >
            <button
              onClick={() => setActiveTab("info")}
              style={{
                padding: "10px 16px",
                fontWeight: 600,
                borderBottom: `2.5px solid ${
                  activeTab === "info" ? "var(--primary)" : "transparent"
                }`,
                color:
                  activeTab === "info" ? "var(--primary)" : "var(--text-muted)",
              }}
            >
              Thông tin cá nhân
            </button>
            <button
              onClick={() => setActiveTab("password")}
              style={{
                padding: "10px 16px",
                fontWeight: 600,
                borderBottom: `2.5px solid ${
                  activeTab === "password" ? "var(--primary)" : "transparent"
                }`,
                color:
                  activeTab === "password"
                    ? "var(--primary)"
                    : "var(--text-muted)",
              }}
            >
              Đổi mật khẩu
            </button>
          </div>

          {activeTab === "info" ? (
            <form onSubmit={handleUpdateProfile}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  marginBottom: "24px",
                }}
              >
                <img
                  src={
                    avatar ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
                  }
                  alt={name}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid var(--border)",
                  }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                    {user?.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-muted)",
                      marginBottom: "6px",
                    }}
                  >
                    {user?.email}
                  </div>
                  <span
                    className={`badge ${
                      user?.role === "admin"
                        ? "badge-danger"
                        : user?.role === "teacher"
                        ? "badge-primary"
                        : "badge-success"
                    }`}
                  >
                    Vai trò: {user?.role}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Họ và Tên *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Số điện thoại</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="0912345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Link ảnh đại diện (Avatar URL)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="https://..."
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tiểu sử / Giới thiệu</label>
                <textarea
                  rows={3}
                  className="form-textarea"
                  placeholder="Vài nét giới thiệu về bạn..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={savingInfo}
                className="btn btn-primary"
              >
                <Save size={18} />
                <span>{savingInfo ? "Đang lưu..." : "Lưu thay đổi"}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label className="form-label">Mật khẩu hiện tại *</label>
                <input
                  type="password"
                  required
                  className="form-control"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mật khẩu mới *</label>
                <input
                  type="password"
                  required
                  className="form-control"
                  placeholder="Tối thiểu 6 ký tự"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Xác nhận mật khẩu mới *</label>
                <input
                  type="password"
                  required
                  className="form-control"
                  placeholder="Nhập lại mật khẩu mới"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={savingPassword}
                className="btn btn-primary"
              >
                <KeyRound size={18} />
                <span>{savingPassword ? "Đang đổi..." : "Cập nhật mật khẩu"}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
