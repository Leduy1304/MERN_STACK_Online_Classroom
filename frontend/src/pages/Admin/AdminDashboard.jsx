import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminAPI, categoryAPI, courseAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/common/Modal";
import {
  Users,
  BookOpen,
  Award,
  Layers,
  ShieldCheck,
  Lock,
  Unlock,
  Trash2,
  Edit,
  Plus,
  Search,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState("users"); // users | categories | courses
  const [loading, setLoading] = useState(true);

  // Users tab state
  const [usersList, setUsersList] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Categories tab state
  const [categoriesList, setCategoriesList] = useState([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    icon: "BookOpen",
  });

  // Courses tab state
  const [coursesList, setCoursesList] = useState([]);

  const fetchAdminData = async () => {
    try {
      const [statsRes, userRes, catRes, courseRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getAllUsers({
          keyword: userSearch,
          role: roleFilter,
          status: statusFilter,
        }),
        categoryAPI.getAll(),
        courseAPI.getAll({ status: "" }),
      ]);

      if (statsRes.success) setStats(statsRes.data?.stats);
      if (userRes.success) setUsersList(userRes.data || []);
      if (catRes.success) setCategoriesList(catRes.data || []);
      if (courseRes.success) setCoursesList(courseRes.data || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [roleFilter, statusFilter]);

  const handleSearchUsers = (e) => {
    e.preventDefault();
    adminAPI
      .getAllUsers({
        keyword: userSearch,
        role: roleFilter,
        status: statusFilter,
      })
      .then((res) => {
        if (res.success) setUsersList(res.data || []);
      })
      .catch((err) => toast.error(err.message));
  };

  // Toggle user active / locked
  const handleToggleUserStatus = async (userId, currentName) => {
    try {
      const res = await adminAPI.toggleStatus(userId);
      if (res.success) {
        toast.success(res.message);
        setUsersList((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isActive: res.data.isActive } : u))
        );
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Change user role
  const handleChangeRole = async (userId, newRole) => {
    try {
      const res = await adminAPI.updateRole(userId, newRole);
      if (res.success) {
        toast.success(res.message);
        setUsersList((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Bạn có chắc muốn xóa vĩnh viễn người dùng [${name}]?`))
      return;

    try {
      const res = await adminAPI.deleteUser(userId);
      if (res.success) {
        toast.success(res.message);
        setUsersList((prev) => prev.filter((u) => u._id !== userId));
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Save category (Create / Update)
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const res = await categoryAPI.update(editingCategory._id, categoryForm);
        if (res.success) {
          toast.success("Cập nhật danh mục thành công!");
          setIsCategoryModalOpen(false);
          const catRes = await categoryAPI.getAll();
          if (catRes.success) setCategoriesList(catRes.data || []);
        }
      } else {
        const res = await categoryAPI.create(categoryForm);
        if (res.success) {
          toast.success("Tạo danh mục mới thành công!");
          setIsCategoryModalOpen(false);
          const catRes = await categoryAPI.getAll();
          if (catRes.success) setCategoriesList(catRes.data || []);
        }
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Delete category
  const handleDeleteCategory = async (catId, catName) => {
    if (!window.confirm(`Xóa danh mục [${catName}]?`)) return;
    try {
      const res = await categoryAPI.delete(catId);
      if (res.success) {
        toast.success("Xóa danh mục thành công!");
        setCategoriesList((prev) => prev.filter((c) => c._id !== catId));
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Delete course
  const handleDeleteCourse = async (courseId, courseTitle) => {
    if (!window.confirm(`Xóa khóa học [${courseTitle}] khỏi toàn hệ thống?`))
      return;
    try {
      const res = await courseAPI.delete(courseId);
      if (res.success) {
        toast.success("Đã xóa khóa học");
        setCoursesList((prev) => prev.filter((c) => c._id !== courseId));
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="container" style={{ paddingTop: "30px" }}>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "2.2rem", marginBottom: "6px" }}>
          Bảng Điều Khiển Quản Trị Hệ Thống
        </h1>
        <p style={{ color: "var(--text-muted)" }}>
          Quản lý toàn bộ người dùng (Khóa/Mở khóa), phân quyền, quản lý danh mục và giám sát khóa học.
        </p>
      </div>

      {/* Top Stat Cards */}
      <div
        className="grid grid-cols-4 gap-4"
        style={{ marginBottom: "32px" }}
      >
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "4px" }}>
            Tổng người dùng
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary)" }}>
            {stats?.totalUsers || 0}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
            {stats?.totalStudents || 0} Sinh viên • {stats?.totalTeachers || 0} Giảng viên
          </div>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "4px" }}>
            Tổng Khóa học
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--secondary)" }}>
            {stats?.totalCourses || 0}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
            {stats?.totalCategories || 0} Danh mục đào tạo
          </div>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "4px" }}>
            Tổng lượt Ghi danh
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--success)" }}>
            {stats?.totalEnrollments || 0}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Học viên đang theo học
          </div>
        </div>

        <div className="card" style={{ padding: "20px" }}>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "4px" }}>
            Bài tập & Bài nộp
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--warning)" }}>
            {stats?.totalSubmissions || 0}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Trên {stats?.totalAssignments || 0} bài tập đã giao
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="card" style={{ padding: "28px" }}>
        <div
          style={{
            display: "flex",
            gap: "16px",
            borderBottom: "1px solid var(--border)",
            marginBottom: "24px",
          }}
        >
          <button
            onClick={() => setActiveTab("users")}
            style={{
              padding: "10px 18px",
              fontWeight: 700,
              fontSize: "0.95rem",
              borderBottom: `2.5px solid ${
                activeTab === "users" ? "var(--primary)" : "transparent"
              }`,
              color:
                activeTab === "users" ? "var(--primary)" : "var(--text-muted)",
            }}
          >
            Quản lý Người dùng ({usersList.length})
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            style={{
              padding: "10px 18px",
              fontWeight: 700,
              fontSize: "0.95rem",
              borderBottom: `2.5px solid ${
                activeTab === "categories" ? "var(--primary)" : "transparent"
              }`,
              color:
                activeTab === "categories"
                  ? "var(--primary)"
                  : "var(--text-muted)",
            }}
          >
            Quản lý Danh mục ({categoriesList.length})
          </button>

          <button
            onClick={() => setActiveTab("courses")}
            style={{
              padding: "10px 18px",
              fontWeight: 700,
              fontSize: "0.95rem",
              borderBottom: `2.5px solid ${
                activeTab === "courses" ? "var(--primary)" : "transparent"
              }`,
              color:
                activeTab === "courses" ? "var(--primary)" : "var(--text-muted)",
            }}
          >
            Quản lý Toàn bộ Khóa học ({coursesList.length})
          </button>
        </div>

        {/* Tab 1: User Management */}
        {activeTab === "users" && (
          <div>
            {/* Filter Bar */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "14px",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <form
                onSubmit={handleSearchUsers}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flex: 1,
                  minWidth: "260px",
                }}
              >
                <input
                  type="text"
                  placeholder="Tìm theo tên hoặc email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="form-control"
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  Tìm
                </button>
              </form>

              <div style={{ display: "flex", gap: "10px" }}>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="form-select"
                  style={{ width: "auto" }}
                >
                  <option value="">Tất cả vai trò</option>
                  <option value="admin">Admin</option>
                  <option value="teacher">Giảng viên (Teacher)</option>
                  <option value="student">Sinh viên (Student)</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="form-select"
                  style={{ width: "auto" }}
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="false">Đã bị khóa</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Họ & Tên</th>
                    <th>Email</th>
                    <th>Vai trò (Phân quyền)</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                    <th style={{ textAlign: "right" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => (
                    <tr key={u._id}>
                      <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img
                          src={
                            u.avatar ||
                            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
                          }
                          alt=""
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 600 }}>{u.name}</div>
                          {u._id === user?._id && (
                            <span style={{ fontSize: "0.72rem", color: "var(--primary)" }}>
                              (Bạn)
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ color: "var(--text-muted)" }}>{u.email}</td>
                      <td>
                        <select
                          value={u.role}
                          disabled={u._id === user?._id}
                          onChange={(e) => handleChangeRole(u._id, e.target.value)}
                          className="form-select"
                          style={{
                            padding: "4px 8px",
                            fontSize: "0.82rem",
                            width: "120px",
                          }}
                        >
                          <option value="student">Student</option>
                          <option value="teacher">Teacher</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            u.isActive ? "badge-success" : "badge-danger"
                          }`}
                        >
                          {u.isActive ? "Hoạt động" : "Đã bị khóa"}
                        </span>
                      </td>
                      <td style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                        {new Date(u.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {u._id !== user?._id && (
                          <div
                            style={{
                              display: "inline-flex",
                              gap: "6px",
                              alignItems: "center",
                            }}
                          >
                            <button
                              onClick={() => handleToggleUserStatus(u._id, u.name)}
                              className={`btn btn-sm ${
                                u.isActive ? "btn-danger" : "btn-success"
                              }`}
                              title={
                                u.isActive
                                  ? "Khóa tài khoản"
                                  : "Mở khóa tài khoản"
                              }
                            >
                              {u.isActive ? (
                                <>
                                  <Lock size={14} /> <span>Khóa</span>
                                </>
                              ) : (
                                <>
                                  <Unlock size={14} /> <span>Mở khóa</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => handleDeleteUser(u._id, u.name)}
                              className="btn-icon"
                              style={{ color: "var(--danger)" }}
                              title="Xóa người dùng"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Category Management */}
        {activeTab === "categories" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ fontSize: "1.1rem" }}>
                Danh mục Khóa học ({categoriesList.length})
              </h3>
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setCategoryForm({ name: "", description: "", icon: "BookOpen" });
                  setIsCategoryModalOpen(true);
                }}
                className="btn btn-primary btn-sm"
              >
                <Plus size={16} /> Thêm danh mục mới
              </button>
            </div>

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Tên Danh Mục</th>
                    <th>Slug</th>
                    <th>Mô Tả</th>
                    <th>Số Khóa Học</th>
                    <th style={{ textAlign: "right" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {categoriesList.map((cat) => (
                    <tr key={cat._id}>
                      <td style={{ fontWeight: 700 }}>{cat.name}</td>
                      <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                        {cat.slug}
                      </td>
                      <td style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
                        {cat.description || "Chưa có mô tả"}
                      </td>
                      <td>
                        <span className="badge badge-primary">
                          {cat.courseCount || 0} khóa
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "6px" }}>
                          <button
                            onClick={() => {
                              setEditingCategory(cat);
                              setCategoryForm({
                                name: cat.name,
                                description: cat.description || "",
                                icon: cat.icon || "BookOpen",
                              });
                              setIsCategoryModalOpen(true);
                            }}
                            className="btn btn-outline btn-sm"
                          >
                            <Edit size={14} /> Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat._id, cat.name)}
                            className="btn btn-danger btn-sm"
                          >
                            <Trash2 size={14} /> Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: All Courses Management */}
        {activeTab === "courses" && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "1.1rem" }}>
                Quản lý Toàn bộ Khóa học trên Hệ thống ({coursesList.length})
              </h3>
            </div>

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Khóa học</th>
                    <th>Danh mục</th>
                    <th>Giảng viên</th>
                    <th>Trình độ</th>
                    <th>Học viên</th>
                    <th style={{ textAlign: "right" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {coursesList.map((c) => (
                    <tr key={c._id}>
                      <td style={{ fontWeight: 600 }}>
                        <Link
                          to={`/courses/${c._id}`}
                          style={{ color: "var(--primary)" }}
                        >
                          {c.title}
                        </Link>
                      </td>
                      <td>
                        <span className="badge badge-gray">
                          {c.category?.name || "N/A"}
                        </span>
                      </td>
                      <td style={{ color: "var(--text-muted)" }}>
                        {c.teacher?.name}
                      </td>
                      <td>{c.level}</td>
                      <td>{c.studentCount || 0}</td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          onClick={() => handleDeleteCourse(c._id, c.title)}
                          className="btn btn-danger btn-sm"
                        >
                          <Trash2 size={14} /> Xóa vi phạm
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Category Create/Edit */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title={editingCategory ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
      >
        <form onSubmit={handleSaveCategory}>
          <div className="form-group">
            <label className="form-label">Tên danh mục *</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="VD: Lập trình Web Full-stack"
              value={categoryForm.name}
              onChange={(e) =>
                setCategoryForm({ ...categoryForm, name: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mô tả danh mục</label>
            <textarea
              rows={3}
              className="form-textarea"
              placeholder="Mô tả các chủ đề và công nghệ trong danh mục này..."
              value={categoryForm.description}
              onChange={(e) =>
                setCategoryForm({
                  ...categoryForm,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(false)}
              className="btn btn-outline"
            >
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              {editingCategory ? "Cập nhật" : "Tạo danh mục"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
