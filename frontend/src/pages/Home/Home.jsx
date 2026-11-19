import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { courseAPI, categoryAPI } from "../../services/api";
import {
  BookOpen,
  Users,
  Video,
  FileText,
  Award,
  ArrowRight,
  Sparkles,
  Layers,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, catRes] = await Promise.all([
          courseAPI.getAll({ limit: 6 }),
          categoryAPI.getAll(),
        ]);
        if (courseRes.success) setCourses(courseRes.data || []);
        if (catRes.success) setCategories(catRes.data || []);
      } catch (err) {
        console.error("Fetch home data error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
          color: "#ffffff",
          padding: "80px 0 100px 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="container">
          <div style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255, 255, 255, 0.12)",
                backdropFilter: "blur(8px)",
                padding: "6px 16px",
                borderRadius: "var(--radius-full)",
                fontSize: "0.85rem",
                fontWeight: 600,
                marginBottom: "24px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <Sparkles size={16} color="#fbbf24" />
              <span>Đề tài Cuối kỳ Lập trình Web MERN Stack</span>
            </div>

            <h1
              style={{
                fontSize: "2.8rem",
                fontWeight: 800,
                lineHeight: 1.2,
                marginBottom: "20px",
                color: "#ffffff",
              }}
            >
              Hệ thống Lớp học Trực tuyến{" "}
              <span style={{ color: "#38bdf8" }}>Online Classroom</span>
            </h1>

            <p
              style={{
                fontSize: "1.15rem",
                color: "#c7d2fe",
                lineHeight: 1.6,
                marginBottom: "36px",
              }}
            >
              Nền tảng học tập số chuẩn hóa cho Giảng viên và Sinh viên: Tạo lớp học,
              đăng tải tài liệu PDF, bài giảng video, bài tập thực hành và chấm điểm
              trực tuyến bảo mật bằng JWT.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <Link
                to="/courses"
                className="btn btn-primary btn-lg"
                style={{
                  background: "#38bdf8",
                  color: "#0f172a",
                  fontWeight: 700,
                  boxShadow: "0 4px 14px rgba(56, 189, 248, 0.4)",
                }}
              >
                <span>Khám phá Khóa học</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/register"
                className="btn btn-outline btn-lg"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "#ffffff",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                }}
              >
                <span>Đăng ký tham gia ngay</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section style={{ marginTop: "-40px", position: "relative", zIndex: 10 }}>
        <div className="container">
          <div
            className="card"
            style={{
              padding: "30px",
              boxShadow: "var(--shadow-xl)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "24px",
              textAlign: "center",
              background: "#ffffff",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "2.2rem",
                  fontWeight: 800,
                  color: "var(--primary)",
                  marginBottom: "4px",
                }}
              >
                100%
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Chuẩn MERN Stack & REST API
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "2.2rem",
                  fontWeight: 800,
                  color: "var(--secondary)",
                  marginBottom: "4px",
                }}
              >
                3 Roles
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Admin, Giảng viên & Sinh viên
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "2.2rem",
                  fontWeight: 800,
                  color: "var(--success)",
                  marginBottom: "4px",
                }}
              >
                JWT Auth
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Xác thực bảo mật & Phân quyền
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: "2.2rem",
                  fontWeight: 800,
                  color: "var(--warning)",
                  marginBottom: "4px",
                }}
              >
                Multi-media
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                PDF, Video nhúng & Bài đọc
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section style={{ padding: "70px 0 30px 0" }}>
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "32px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "var(--primary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "6px",
                }}
              >
                Danh mục nổi bật
              </div>
              <h2 style={{ fontSize: "1.8rem" }}>Lĩnh vực đào tạo</h2>
            </div>
            <Link
              to="/courses"
              style={{
                color: "var(--primary)",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>Xem tất cả</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/courses?category=${cat._id}`}
                className="card"
                style={{
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "12px",
                  transition: "var(--transition)",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "var(--primary-light)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Layers size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "4px" }}>
                    {cat.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-muted)",
                      lineHeight: 1.4,
                    }}
                  >
                    {cat.courseCount || 0} khóa học đang mở
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section style={{ padding: "50px 0 70px 0" }}>
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "32px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "var(--primary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "6px",
                }}
              >
                Khóa học tiêu biểu
              </div>
              <h2 style={{ fontSize: "1.8rem" }}>Các lớp học mới nhất</h2>
            </div>
            <Link
              to="/courses"
              className="btn btn-outline btn-sm"
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <span>Tất cả khóa học</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p style={{ color: "var(--text-muted)" }}>Đang tải danh sách khóa học...</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ position: "relative", height: "180px" }}>
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <span
                      className="badge badge-primary"
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      {course.category?.name || "Khóa học"}
                    </span>
                    <span
                      className="badge badge-gray"
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                      }}
                    >
                      {course.level || "Cơ bản"}
                    </span>
                  </div>

                  <div
                    style={{
                      padding: "20px",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: "1.1rem",
                          marginBottom: "10px",
                          lineHeight: 1.4,
                        }}
                      >
                        <Link
                          to={`/courses/${course._id}`}
                          style={{ color: "var(--text-main)" }}
                        >
                          {course.title}
                        </Link>
                      </h3>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--text-muted)",
                          lineHeight: 1.5,
                          marginBottom: "16px",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {course.description}
                      </p>
                    </div>

                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          fontSize: "0.82rem",
                          color: "var(--text-muted)",
                          paddingTop: "14px",
                          borderTop: "1px solid var(--border)",
                          marginBottom: "14px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <img
                            src={
                              course.teacher?.avatar ||
                              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
                            }
                            alt=""
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                          <span>{course.teacher?.name}</span>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <Users size={14} /> {course.studentCount || 0}
                          </span>
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <BookOpen size={14} /> {course.materialCount || 0} bài
                          </span>
                        </div>
                      </div>

                      <Link
                        to={`/courses/${course._id}`}
                        className="btn btn-outline"
                        style={{ width: "100%" }}
                      >
                        Chi tiết khóa học
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Feature Architecture Overview */}
      <section
        style={{
          background: "#ffffff",
          padding: "70px 0",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "650px", margin: "0 auto 50px auto" }}>
            <h2 style={{ fontSize: "2rem", marginBottom: "12px" }}>
              Tính năng Hệ thống Phân quyền 3 Cấp
            </h2>
            <p style={{ color: "var(--text-muted)" }}>
              Được thiết kế đáp ứng chặt chẽ các yêu cầu của Đề tài Tiểu luận Cuối kỳ môn
              Lập trình Web.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div
              className="card"
              style={{
                padding: "30px",
                borderTop: "4px solid var(--danger)",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "var(--danger-light)",
                  color: "var(--danger)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "10px" }}>
                1. Vai trò Quản trị (Admin)
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  fontSize: "0.88rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.8,
                }}
              >
                <li>✓ Bảng thống kê hệ thống (Users, Courses, Submissions)</li>
                <li>✓ Quản lý toàn bộ người dùng (Khóa / Mở khóa tài khoản)</li>
                <li>✓ Phân quyền tài khoản (Admin, Teacher, Student)</li>
                <li>✓ Quản lý danh mục khóa học (Categories CRUD)</li>
              </ul>
            </div>

            <div
              className="card"
              style={{
                padding: "30px",
                borderTop: "4px solid var(--primary)",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "var(--primary-light)",
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <Award size={26} />
              </div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "10px" }}>
                2. Vai trò Giảng viên (Teacher)
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  fontSize: "0.88rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.8,
                }}
              >
                <li>✓ CRUD khóa học phụ trách</li>
                <li>✓ Đăng tải tài liệu học tập (PDF, Video link, Bài đọc)</li>
                <li>✓ Tạo bài tập có hạn nộp và điểm tối đa</li>
                <li>✓ Xem danh sách sinh viên ghi danh và chấm điểm bài tập</li>
              </ul>
            </div>

            <div
              className="card"
              style={{
                padding: "30px",
                borderTop: "4px solid var(--success)",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "var(--success-light)",
                  color: "var(--success)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <GraduationCap size={26} />
              </div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "10px" }}>
                3. Vai trò Sinh viên (Student)
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  fontSize: "0.88rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.8,
                }}
              >
                <li>✓ Tìm kiếm và Ghi danh (Enroll) vào khóa học đang mở</li>
                <li>✓ Xem video, đọc tài liệu PDF và bài giảng lý thuyết</li>
                <li>✓ Nộp bài tập (văn bản & đính kèm tệp tin)</li>
                <li>✓ Theo dõi tiến trình học tập và xem điểm số, nhận xét</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
