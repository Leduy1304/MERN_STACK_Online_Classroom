import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { courseAPI, enrollmentAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  BookOpen,
  Video,
  FileText,
  Clock,
  Users,
  CheckCircle2,
  Calendar,
  Award,
  ArrowRight,
  ShieldCheck,
  PlayCircle,
} from "lucide-react";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isStudent, isTeacher, isAdmin } = useAuth();
  const toast = useToast();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  const fetchCourse = async () => {
    try {
      const res = await courseAPI.getById(id);
      if (res.success) {
        setCourse(res.data);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.info("Vui lòng đăng nhập để ghi danh khóa học");
      navigate("/login");
      return;
    }

    setEnrolling(true);
    try {
      const res = await enrollmentAPI.enroll(id);
      if (res.success) {
        toast.success("Ghi danh thành công! Đang chuyển đến phòng học...");
        navigate(`/learn/${id}`);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <p style={{ color: "var(--text-muted)" }}>Đang tải thông tin khóa học...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container" style={{ padding: "80px 20px", textAlign: "center" }}>
        <h2>Không tìm thấy khóa học</h2>
        <Link to="/courses" className="btn btn-primary" style={{ marginTop: "16px" }}>
          Quay lại danh sách khóa học
        </Link>
      </div>
    );
  }

  const materials = course.materials || [];
  const assignments = course.assignments || [];

  return (
    <div style={{ paddingTop: "30px" }}>
      {/* Course Header Banner */}
      <div
        style={{
          background: "#ffffff",
          borderBottom: "1px solid var(--border)",
          padding: "40px 0",
          marginBottom: "40px",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr",
              gap: "40px",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                <span className="badge badge-primary">
                  {course.category?.name || "Danh mục"}
                </span>
                <span className="badge badge-gray">{course.level || "Cơ bản"}</span>
              </div>

              <h1
                style={{
                  fontSize: "2.4rem",
                  lineHeight: 1.25,
                  marginBottom: "16px",
                }}
              >
                {course.title}
              </h1>

              <p
                style={{
                  fontSize: "1.05rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.6,
                  marginBottom: "24px",
                }}
              >
                {course.description}
              </p>

              {/* Teacher Info */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  background: "var(--bg-subtle)",
                  borderRadius: "var(--radius-md)",
                  width: "fit-content",
                }}
              >
                <img
                  src={
                    course.teacher?.avatar ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
                  }
                  alt={course.teacher?.name}
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    Giảng viên phụ trách
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                    {course.teacher?.name}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card / CTA Box */}
            <div
              className="card"
              style={{
                padding: "24px",
                boxShadow: "var(--shadow-xl)",
                background: "#ffffff",
              }}
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                style={{
                  width: "100%",
                  height: "200px",
                  borderRadius: "var(--radius-md)",
                  objectFit: "cover",
                  marginBottom: "20px",
                }}
              />

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.92rem",
                  }}
                >
                  <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <BookOpen size={16} /> Số lượng bài học
                  </span>
                  <strong>{materials.length} bài</strong>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.92rem",
                  }}
                >
                  <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Award size={16} /> Bài tập thực hành
                  </span>
                  <strong>{assignments.length} bài tập</strong>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.92rem",
                  }}
                >
                  <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Users size={16} /> Sinh viên đã ghi danh
                  </span>
                  <strong>{course.studentCount || 0} học viên</strong>
                </div>
              </div>

              {/* Action Buttons */}
              {course.isEnrolled ? (
                <div>
                  <div style={{ marginBottom: "16px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.85rem",
                        marginBottom: "6px",
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>Tiến trình học tập</span>
                      <span style={{ fontWeight: 700, color: "var(--primary)" }}>
                        {course.enrollment?.progress || 0}%
                      </span>
                    </div>
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${course.enrollment?.progress || 0}%`,
                        }}
                      />
                    </div>
                  </div>

                  <Link
                    to={`/learn/${course._id}`}
                    className="btn btn-primary btn-lg"
                    style={{ width: "100%" }}
                  >
                    <span>Vào phòng học ngay</span>
                    <ArrowRight size={18} />
                  </Link>
                </div>
              ) : isTeacher || isAdmin ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <Link
                    to={`/learn/${course._id}`}
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                  >
                    <span>Xem trước phòng học</span>
                    <PlayCircle size={18} />
                  </Link>
                  {isTeacher && (
                    <Link
                      to="/teacher"
                      className="btn btn-outline"
                      style={{ width: "100%" }}
                    >
                      Quản lý giảng dạy
                    </Link>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="btn btn-primary btn-lg"
                  style={{ width: "100%" }}
                >
                  <span>{enrolling ? "Đang xử lý..." : "Ghi danh khóa học (Miễn phí)"}</span>
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Curriculum & Details */}
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "30px",
          }}
        >
          {/* Left Column: Lessons & Assignments */}
          <div>
            {/* Materials List */}
            <div className="card" style={{ padding: "28px", marginBottom: "30px" }}>
              <h2 style={{ fontSize: "1.4rem", marginBottom: "20px" }}>
                Giáo trình & Nội dung bài học ({materials.length} phần)
              </h2>

              {materials.length === 0 ? (
                <p style={{ color: "var(--text-muted)" }}>
                  Giảng viên đang biên soạn tài liệu cho khóa học này.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {materials.map((m, idx) => (
                    <div
                      key={m._id || idx}
                      style={{
                        padding: "16px",
                        background: "var(--bg-subtle)",
                        borderRadius: "var(--radius-md)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "8px",
                            background:
                              m.type === "video"
                                ? "#e0f2fe"
                                : m.type === "pdf"
                                ? "#fee2e2"
                                : "#d1fae5",
                            color:
                              m.type === "video"
                                ? "#0284c7"
                                : m.type === "pdf"
                                ? "#dc2626"
                                : "#059669",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {m.type === "video" && <Video size={18} />}
                          {m.type === "pdf" && <FileText size={18} />}
                          {m.type === "reading" && <BookOpen size={18} />}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                            {m.title}
                          </div>
                          <div
                            style={{
                              fontSize: "0.78rem",
                              color: "var(--text-muted)",
                              textTransform: "uppercase",
                            }}
                          >
                            {m.type === "video"
                              ? "Video bài giảng"
                              : m.type === "pdf"
                              ? "Tài liệu PDF"
                              : "Bài đọc lý thuyết"}{" "}
                            • {m.duration || "15 phút"}
                          </div>
                        </div>
                      </div>

                      {course.isEnrolled && (
                        <span
                          className={`badge ${
                            course.enrollment?.completedMaterials?.includes(m._id)
                              ? "badge-success"
                              : "badge-gray"
                          }`}
                        >
                          {course.enrollment?.completedMaterials?.includes(m._id)
                            ? "Đã học"
                            : "Chưa học"}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Assignments List */}
            <div className="card" style={{ padding: "28px" }}>
              <h2 style={{ fontSize: "1.4rem", marginBottom: "20px" }}>
                Bài tập thực hành ({assignments.length})
              </h2>

              {assignments.length === 0 ? (
                <p style={{ color: "var(--text-muted)" }}>
                  Chưa có bài tập nào được tạo cho khóa học này.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {assignments.map((a) => (
                    <div
                      key={a._id}
                      style={{
                        padding: "18px",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-md)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "8px",
                        }}
                      >
                        <h4 style={{ fontSize: "1.05rem" }}>{a.title}</h4>
                        <span className="badge badge-warning">
                          Điểm tối đa: {a.maxScore || 10}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: "0.88rem",
                          color: "var(--text-muted)",
                          lineHeight: 1.5,
                          marginBottom: "12px",
                        }}
                      >
                        {a.description}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "0.82rem",
                          color: "#b45309",
                        }}
                      >
                        <Calendar size={14} />
                        <span>
                          Hạn nộp:{" "}
                          {new Date(a.deadline).toLocaleDateString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Teacher Bio & FAQ */}
          <div>
            <div className="card" style={{ padding: "24px", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "16px" }}>
                Về Giảng viên
              </h3>
              <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "14px" }}>
                <img
                  src={
                    course.teacher?.avatar ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
                  }
                  alt={course.teacher?.name}
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <div>
                  <div style={{ fontWeight: 700 }}>{course.teacher?.name}</div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                    {course.teacher?.email}
                  </div>
                </div>
              </div>
              <p
                style={{
                  fontSize: "0.88rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.5,
                }}
              >
                {course.teacher?.bio ||
                  "Giảng viên giàu kinh nghiệm, tâm huyết trong việc đào tạo và hướng dẫn sinh viên xây dựng các ứng dụng web thực tế."}
              </p>
            </div>

            <div className="card" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "16px" }}>
                Cam kết khóa học
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  fontSize: "0.88rem",
                  color: "var(--text-muted)",
                }}
              >
                <li style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <CheckCircle2 size={16} color="var(--success)" />
                  <span>Truy cập trọn đời tài liệu bài học</span>
                </li>
                <li style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <CheckCircle2 size={16} color="var(--success)" />
                  <span>Nộp bài tập và nhận chấm điểm trực tuyến</span>
                </li>
                <li style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <CheckCircle2 size={16} color="var(--success)" />
                  <span>Chứng nhận hoàn thành khi đạt 100% tiến độ</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
