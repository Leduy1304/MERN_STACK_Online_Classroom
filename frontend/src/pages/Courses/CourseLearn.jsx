import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  courseAPI,
  enrollmentAPI,
  assignmentAPI,
  submissionAPI,
  uploadAPI,
} from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  BookOpen,
  Video,
  FileText,
  CheckCircle,
  Circle,
  Award,
  Upload,
  ArrowLeft,
  Calendar,
  ExternalLink,
  MessageSquare,
  AlertTriangle,
  Download,
} from "lucide-react";

const CourseLearn = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected item: { type: 'material' | 'assignment', item: Object }
  const [selectedItem, setSelectedItem] = useState(null);

  // Student submission form states
  const [submissionText, setSubmissionText] = useState("");
  const [submissionFile, setSubmissionFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState(null);

  const fetchClassroomData = async () => {
    try {
      const [courseRes, enrollRes, assignRes] = await Promise.all([
        courseAPI.getById(id),
        enrollmentAPI.checkEnrollment(id),
        assignmentAPI.getByCourse(id),
      ]);

      if (courseRes.success) setCourse(courseRes.data);
      if (enrollRes.success && enrollRes.data) setEnrollment(enrollRes.data);
      if (assignRes.success) setAssignments(assignRes.data || []);

      // Set default selected item to first material or assignment
      if (courseRes.data?.materials?.length > 0) {
        setSelectedItem({
          type: "material",
          item: courseRes.data.materials[0],
        });
      } else if (assignRes.data?.length > 0) {
        setSelectedItem({
          type: "assignment",
          item: assignRes.data[0],
        });
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassroomData();
  }, [id]);

  // Load student's submission when an assignment is selected
  useEffect(() => {
    if (selectedItem?.type === "assignment") {
      submissionAPI
        .getMySubmission(selectedItem.item._id)
        .then((res) => {
          if (res.success) {
            setCurrentSubmission(res.data);
            if (res.data) {
              setSubmissionText(res.data.submissionText || "");
            } else {
              setSubmissionText("");
            }
          }
        })
        .catch((err) => console.error(err));
    }
  }, [selectedItem]);

  const handleToggleComplete = async (materialId) => {
    try {
      const res = await enrollmentAPI.updateProgress(id, materialId);
      if (res.success) {
        setEnrollment(res.data);
        toast.success(res.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    if (!submissionText && !submissionFile) {
      toast.error("Vui lòng nhập nội dung bài làm hoặc đính kèm tệp tin");
      return;
    }

    setSubmitting(true);
    try {
      let fileUrl = "";
      let fileName = "";

      if (submissionFile) {
        const uploadRes = await uploadAPI.uploadFile(submissionFile);
        if (uploadRes.success) {
          fileUrl = uploadRes.data.url;
          fileName = uploadRes.data.fileName;
        }
      }

      const res = await submissionAPI.submit(selectedItem.item._id, {
        submissionText,
        fileUrl: fileUrl || currentSubmission?.fileUrl || "",
        fileName: fileName || currentSubmission?.fileName || "",
      });

      if (res.success) {
        toast.success("Nộp bài tập thành công!");
        setCurrentSubmission(res.data);
        setSubmissionFile(null);
        // Refresh assignments list to update status badges
        const assignRes = await assignmentAPI.getByCourse(id);
        if (assignRes.success) setAssignments(assignRes.data || []);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <p style={{ color: "var(--text-muted)" }}>Đang tải phòng học...</p>
      </div>
    );
  }

  const materials = course?.materials || [];

  return (
    <div
      style={{
        display: "flex",
        minHeight: "calc(100vh - 70px)",
        background: "#ffffff",
      }}
    >
      {/* Sidebar: Course Content & Progress */}
      <div
        style={{
          width: "360px",
          borderRight: "1px solid var(--border)",
          background: "var(--bg-main)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        {/* Sidebar Header */}
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid var(--border)",
            background: "#ffffff",
          }}
        >
          <Link
            to={`/courses/${id}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              marginBottom: "12px",
            }}
          >
            <ArrowLeft size={16} />
            <span>Quay lại trang thông tin</span>
          </Link>

          <h3
            style={{
              fontSize: "1.1rem",
              lineHeight: 1.3,
              marginBottom: "14px",
            }}
          >
            {course?.title}
          </h3>

          {/* Progress bar */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.82rem",
                marginBottom: "6px",
              }}
            >
              <span style={{ fontWeight: 600 }}>Tiến trình học tập</span>
              <span style={{ fontWeight: 700, color: "var(--primary)" }}>
                {enrollment?.progress || 0}%
              </span>
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${enrollment?.progress || 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Lessons & Assignments Tree */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          {/* Section 1: Materials */}
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "10px",
                paddingLeft: "8px",
              }}
            >
              Bài giảng & Tài liệu ({materials.length})
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {materials.map((m, idx) => {
                const isCompleted = enrollment?.completedMaterials?.includes(m._id);
                const isSelected =
                  selectedItem?.type === "material" &&
                  selectedItem.item._id === m._id;

                return (
                  <button
                    key={m._id || idx}
                    onClick={() => setSelectedItem({ type: "material", item: m })}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      textAlign: "left",
                      background: isSelected ? "var(--primary-light)" : "#ffffff",
                      border: `1px solid ${
                        isSelected ? "var(--primary)" : "var(--border)"
                      }`,
                      transition: "var(--transition)",
                    }}
                  >
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleComplete(m._id);
                      }}
                      title={
                        isCompleted
                          ? "Bấm để bỏ đánh dấu hoàn thành"
                          : "Bấm để đánh dấu đã học xong"
                      }
                      style={{ cursor: "pointer", color: isCompleted ? "var(--success)" : "var(--text-light)" }}
                    >
                      {isCompleted ? (
                        <CheckCircle size={18} />
                      ) : (
                        <Circle size={18} />
                      )}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? "var(--primary-dark)" : "var(--text-main)",
                          lineHeight: 1.3,
                        }}
                      >
                        {m.title}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                          marginTop: "2px",
                        }}
                      >
                        {m.type === "video" ? "Video" : m.type === "pdf" ? "PDF" : "Bài đọc"} • {m.duration}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Assignments */}
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "10px",
                paddingLeft: "8px",
              }}
            >
              Bài tập thực hành ({assignments.length})
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {assignments.map((a) => {
                const isSelected =
                  selectedItem?.type === "assignment" &&
                  selectedItem.item._id === a._id;
                const submission = a.mySubmission;

                return (
                  <button
                    key={a._id}
                    onClick={() =>
                      setSelectedItem({ type: "assignment", item: a })
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      textAlign: "left",
                      background: isSelected ? "var(--primary-light)" : "#ffffff",
                      border: `1px solid ${
                        isSelected ? "var(--primary)" : "var(--border)"
                      }`,
                      transition: "var(--transition)",
                    }}
                  >
                    <Award
                      size={18}
                      color={
                        submission?.status === "graded"
                          ? "var(--success)"
                          : submission
                          ? "var(--primary)"
                          : "var(--warning)"
                      }
                    />

                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "0.88rem",
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? "var(--primary-dark)" : "var(--text-main)",
                          lineHeight: 1.3,
                        }}
                      >
                        {a.title}
                      </div>
                      <div style={{ marginTop: "4px" }}>
                        {submission?.status === "graded" ? (
                          <span
                            className="badge badge-success"
                            style={{ fontSize: "0.7rem", padding: "1px 6px" }}
                          >
                            Đã chấm: {submission.score}/{a.maxScore}
                          </span>
                        ) : submission ? (
                          <span
                            className="badge badge-primary"
                            style={{ fontSize: "0.7rem", padding: "1px 6px" }}
                          >
                            Đã nộp bài
                          </span>
                        ) : (
                          <span
                            className="badge badge-warning"
                            style={{ fontSize: "0.7rem", padding: "1px 6px" }}
                          >
                            Chưa nộp
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Classroom Viewer Area */}
      <div style={{ flex: 1, padding: "32px 40px", overflowY: "auto" }}>
        {selectedItem?.type === "material" && (
          <div style={{ maxWidth: "860px", margin: "0 auto" }}>
            {/* Material Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div>
                <span
                  className="badge badge-primary"
                  style={{ marginBottom: "8px" }}
                >
                  {selectedItem.item.type === "video"
                    ? "Video bài giảng"
                    : selectedItem.item.type === "pdf"
                    ? "Tài liệu PDF"
                    : "Bài đọc lý thuyết"}
                </span>
                <h1 style={{ fontSize: "1.8rem" }}>
                  {selectedItem.item.title}
                </h1>
              </div>

              <button
                onClick={() => handleToggleComplete(selectedItem.item._id)}
                className={`btn ${
                  enrollment?.completedMaterials?.includes(selectedItem.item._id)
                    ? "btn-success"
                    : "btn-outline"
                }`}
              >
                <CheckCircle size={18} />
                <span>
                  {enrollment?.completedMaterials?.includes(selectedItem.item._id)
                    ? "Đã hoàn thành"
                    : "Đánh dấu hoàn thành"}
                </span>
              </button>
            </div>

            {/* Content Renderer by Type */}
            {selectedItem.item.type === "video" && (
              <div style={{ marginBottom: "30px" }}>
                <div
                  style={{
                    position: "relative",
                    paddingBottom: "56.25%",
                    height: 0,
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                    background: "#000000",
                    boxShadow: "var(--shadow-lg)",
                  }}
                >
                  <iframe
                    src={selectedItem.item.videoUrl}
                    title={selectedItem.item.title}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: 0,
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                {selectedItem.item.content && (
                  <div
                    className="card"
                    style={{ marginTop: "20px", padding: "20px" }}
                  >
                    <h4 style={{ marginBottom: "8px" }}>Ghi chú bài học:</h4>
                    <p style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
                      {selectedItem.item.content}
                    </p>
                  </div>
                )}
              </div>
            )}

            {selectedItem.item.type === "pdf" && (
              <div style={{ marginBottom: "30px" }}>
                <div
                  className="card"
                  style={{
                    padding: "24px",
                    textAlign: "center",
                    marginBottom: "20px",
                    background: "#f8fafc",
                  }}
                >
                  <FileText
                    size={48}
                    color="var(--primary)"
                    style={{ margin: "0 auto 12px auto" }}
                  />
                  <h3 style={{ marginBottom: "6px" }}>Tài liệu đính kèm</h3>
                  <p style={{ color: "var(--text-muted)", marginBottom: "16px" }}>
                    {selectedItem.item.content ||
                      "Bạn có thể xem trực tiếp hoặc tải tài liệu PDF về máy để ôn tập."}
                  </p>
                  {selectedItem.item.fileUrl && (
                    <a
                      href={selectedItem.item.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary"
                    >
                      <Download size={18} />
                      <span>Xem và Tải tài liệu PDF</span>
                    </a>
                  )}
                </div>

                {selectedItem.item.fileUrl && (
                  <div
                    style={{
                      height: "600px",
                      borderRadius: "var(--radius-lg)",
                      overflow: "hidden",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <iframe
                      src={selectedItem.item.fileUrl}
                      title="PDF Viewer"
                      style={{ width: "100%", height: "100%", border: "none" }}
                    />
                  </div>
                )}
              </div>
            )}

            {selectedItem.item.type === "reading" && (
              <div
                className="card"
                style={{
                  padding: "36px",
                  lineHeight: 1.8,
                  fontSize: "1rem",
                  color: "#1e293b",
                }}
              >
                <div
                  style={{
                    whiteSpace: "pre-wrap",
                    fontFamily: "inherit",
                  }}
                >
                  {selectedItem.item.content}
                </div>
              </div>
            )}
          </div>
        )}

        {selectedItem?.type === "assignment" && (
          <div style={{ maxWidth: "860px", margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "24px",
              }}
            >
              <div>
                <span className="badge badge-warning" style={{ marginBottom: "8px" }}>
                  Bài tập thực hành
                </span>
                <h1 style={{ fontSize: "1.8rem", marginBottom: "8px" }}>
                  {selectedItem.item.title}
                </h1>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    color: "var(--text-muted)",
                    fontSize: "0.88rem",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Calendar size={16} /> Hạn nộp:{" "}
                    {new Date(selectedItem.item.deadline).toLocaleDateString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                  <span>• Điểm tối đa: {selectedItem.item.maxScore || 10}</span>
                </div>
              </div>
            </div>

            {/* Assignment Prompt Card */}
            <div
              className="card"
              style={{ padding: "24px", marginBottom: "30px", background: "#f8fafc" }}
            >
              <h3 style={{ fontSize: "1.1rem", marginBottom: "10px" }}>
                Yêu cầu đề bài:
              </h3>
              <p style={{ lineHeight: 1.6, color: "var(--text-main)", whiteSpace: "pre-wrap" }}>
                {selectedItem.item.description}
              </p>
              {selectedItem.item.attachmentUrl && (
                <div style={{ marginTop: "16px" }}>
                  <a
                    href={selectedItem.item.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    <Download size={16} /> Tệp đề bài mẫu đính kèm
                  </a>
                </div>
              )}
            </div>

            {/* Submission Status & Grading Feedback Card */}
            {currentSubmission && currentSubmission.status === "graded" && (
              <div
                className="card"
                style={{
                  padding: "24px",
                  marginBottom: "30px",
                  borderLeft: "6px solid var(--success)",
                  background: "#f0fdf4",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <h3 style={{ color: "#166534" }}>Kết quả chấm điểm của Giảng viên</h3>
                  <span
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: 800,
                      color: "var(--success)",
                    }}
                  >
                    {currentSubmission.score} / {selectedItem.item.maxScore || 10} Điểm
                  </span>
                </div>
                <p style={{ color: "#15803d", marginBottom: "8px", fontWeight: 600 }}>
                  Nhận xét & Lời phê:
                </p>
                <div
                  style={{
                    background: "#ffffff",
                    padding: "16px",
                    borderRadius: "8px",
                    border: "1px solid #bbf7d0",
                    color: "#1e293b",
                  }}
                >
                  {currentSubmission.feedback || "Giảng viên chưa để lại nhận xét."}
                </div>
              </div>
            )}

            {/* Student Submission Form */}
            <div className="card" style={{ padding: "28px" }}>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "16px" }}>
                {currentSubmission ? "Bài tập đã nộp" : "Nộp bài tập"}
              </h3>

              {currentSubmission && currentSubmission.status === "graded" ? (
                <div>
                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ fontWeight: 600, marginBottom: "6px" }}>
                      Nội dung bài làm:
                    </div>
                    <div
                      style={{
                        padding: "16px",
                        background: "var(--bg-subtle)",
                        borderRadius: "8px",
                      }}
                    >
                      {currentSubmission.submissionText || "Không có văn bản."}
                    </div>
                  </div>
                  {currentSubmission.fileUrl && (
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: "6px" }}>
                        Tệp tin đính kèm:
                      </div>
                      <a
                        href={currentSubmission.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline btn-sm"
                      >
                        <Download size={16} /> {currentSubmission.fileName || "Tải tệp bài nộp"}
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmitAssignment}>
                  {currentSubmission && (
                    <div
                      style={{
                        padding: "12px 16px",
                        background: "var(--primary-light)",
                        color: "var(--primary-dark)",
                        borderRadius: "var(--radius-md)",
                        marginBottom: "18px",
                        fontSize: "0.88rem",
                      }}
                    >
                      Bạn đã nộp bài vào{" "}
                      {new Date(currentSubmission.submittedAt).toLocaleString("vi-VN")}.
                      Bạn có thể chỉnh sửa và cập nhật bài nộp bên dưới trước khi giảng viên chấm điểm.
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">
                      Nội dung bài làm (Văn bản hoặc đường link Github / Google Drive):
                    </label>
                    <textarea
                      rows={5}
                      className="form-textarea"
                      placeholder="Nhập phần trả lời bài tập, link repository GitHub hoặc mô tả giải pháp của bạn..."
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Đính kèm tệp tin bài làm (PDF, Word, Zip source code...):
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => setSubmissionFile(e.target.files[0])}
                    />
                    {currentSubmission?.fileUrl && !submissionFile && (
                      <p
                        style={{
                          fontSize: "0.82rem",
                          color: "var(--text-muted)",
                          marginTop: "6px",
                        }}
                      >
                        Tệp tin hiện tại:{" "}
                        <a
                          href={currentSubmission.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "var(--primary)", textDecoration: "underline" }}
                        >
                          {currentSubmission.fileName || "Xem tệp đã tải lên"}
                        </a>
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary"
                  >
                    <Upload size={18} />
                    <span>
                      {submitting
                        ? "Đang lưu..."
                        : currentSubmission
                        ? "Cập nhật bài nộp"
                        : "Nộp bài tập"}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseLearn;
