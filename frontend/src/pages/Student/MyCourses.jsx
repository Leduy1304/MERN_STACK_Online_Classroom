import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { enrollmentAPI } from "../../services/api";
import { useToast } from "../../context/ToastContext";
import {
  GraduationCap,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Clock,
  PlayCircle,
} from "lucide-react";

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await enrollmentAPI.getMyEnrolled();
        if (res.success) {
          setEnrollments(res.data || []);
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <p style={{ color: "var(--text-muted)" }}>Đang tải danh sách khóa học của bạn...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "40px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "2.2rem", marginBottom: "8px" }}>
          Khóa học của tôi
        </h1>
        <p style={{ color: "var(--text-muted)" }}>
          Theo dõi tiến trình học tập và tiếp tục các bài giảng đang tham gia.
        </p>
      </div>

      {enrollments.length === 0 ? (
        <div
          className="card"
          style={{ textAlign: "center", padding: "60px 20px" }}
        >
          <GraduationCap
            size={56}
            color="var(--text-muted)"
            style={{ margin: "0 auto 16px auto" }}
          />
          <h3 style={{ marginBottom: "8px" }}>
            Bạn chưa ghi danh vào khóa học nào
          </h3>
          <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
            Khám phá thư viện khóa học và bắt đầu lộ trình học tập của bạn ngay hôm nay!
          </p>
          <Link to="/courses" className="btn btn-primary">
            Khám phá khóa học ngay
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {enrollments.map((en) => {
            const course = en.course;
            if (!course) return null;

            return (
              <div
                key={en._id}
                className="card"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div style={{ position: "relative", height: "170px" }}>
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <span
                    className={`badge ${
                      en.progress === 100 ? "badge-success" : "badge-primary"
                    }`}
                    style={{ position: "absolute", top: "12px", right: "12px" }}
                  >
                    {en.progress === 100 ? "Đã hoàn thành" : "Đang học"}
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
                    <span
                      className="badge badge-gray"
                      style={{ marginBottom: "8px" }}
                    >
                      {course.category?.name || "Khóa học"}
                    </span>
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
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-muted)",
                        marginBottom: "16px",
                      }}
                    >
                      Giảng viên: {course.teacher?.name}
                    </div>
                  </div>

                  <div>
                    {/* Progress Bar */}
                    <div style={{ marginBottom: "16px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.82rem",
                          marginBottom: "6px",
                        }}
                      >
                        <span style={{ color: "var(--text-muted)" }}>Tiến độ</span>
                        <strong style={{ color: "var(--primary)" }}>
                          {en.progress}%
                        </strong>
                      </div>
                      <div className="progress-bar-bg">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${en.progress}%` }}
                        />
                      </div>
                    </div>

                    <Link
                      to={`/learn/${course._id}`}
                      className="btn btn-primary"
                      style={{ width: "100%" }}
                    >
                      <PlayCircle size={18} />
                      <span>{en.progress > 0 ? "Tiếp tục học" : "Bắt đầu học"}</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
