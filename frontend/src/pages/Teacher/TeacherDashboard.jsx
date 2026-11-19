import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  courseAPI,
  categoryAPI,
  assignmentAPI,
  submissionAPI,
  enrollmentAPI,
  uploadAPI,
} from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/common/Modal";
import {
  BookOpen,
  Plus,
  Users,
  Award,
  Video,
  FileText,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  Clock,
  Download,
  Calendar,
} from "lucide-react";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected course for detailed management (Materials, Assignments, Students)
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("materials"); // materials | assignments | students | submissions

  // Course Modal
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    category: "",
    thumbnail: "",
    level: "Cơ bản",
    status: "published",
  });

  // Material Modal
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [materialForm, setMaterialForm] = useState({
    title: "",
    type: "video",
    videoUrl: "",
    fileUrl: "",
    content: "",
    duration: "15 phút",
  });
  const [uploadingMaterialFile, setUploadingMaterialFile] = useState(false);

  // Assignment Modal
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    description: "",
    deadline: "",
    maxScore: 10,
    attachmentUrl: "",
  });

  // Detailed data for active course
  const [courseAssignments, setCourseAssignments] = useState([]);
  const [courseStudents, setCourseStudents] = useState([]);
  const [allSubmissions, setAllSubmissions] = useState([]);

  // Grade Modal
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeForm, setGradeForm] = useState({ score: "", feedback: "" });

  const fetchTeachingCourses = async () => {
    try {
      const [res, catRes] = await Promise.all([
        courseAPI.getMyTeachingCourses(),
        categoryAPI.getAll(),
      ]);
      if (res.success) {
        setCourses(res.data || []);
        if (res.data?.length > 0 && !activeCourse) {
          setActiveCourse(res.data[0]);
        }
      }
      if (catRes.success) setCategories(catRes.data || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachingCourses();
  }, []);

  // When active course changes, load its assignments, students, submissions
  const loadCourseDetails = async (courseId) => {
    try {
      const [assignRes, studRes] = await Promise.all([
        assignmentAPI.getByCourse(courseId),
        enrollmentAPI.getCourseStudents(courseId),
      ]);

      if (assignRes.success) {
        setCourseAssignments(assignRes.data || []);

        // Load submissions for all assignments in this course
        const subPromises = assignRes.data.map((a) =>
          submissionAPI.getByAssignment(a._id)
        );
        const subResults = await Promise.all(subPromises);
        let subs = [];
        subResults.forEach((sr, idx) => {
          if (sr.success && sr.data) {
            sr.data.forEach((s) => {
              subs.push({
                ...s,
                assignmentTitle: assignRes.data[idx].title,
                maxScore: assignRes.data[idx].maxScore,
              });
            });
          }
        });
        setAllSubmissions(subs);
      }

      if (studRes.success) {
        setCourseStudents(studRes.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeCourse) {
      loadCourseDetails(activeCourse._id);
    }
  }, [activeCourse]);

  // Handle Save Course (Create / Edit)
  const handleSaveCourse = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        const res = await courseAPI.update(editingCourse._id, courseForm);
        if (res.success) {
          toast.success("Cập nhật khóa học thành công!");
          setIsCourseModalOpen(false);
          fetchTeachingCourses();
        }
      } else {
        const res = await courseAPI.create(courseForm);
        if (res.success) {
          toast.success("Tạo khóa học mới thành công!");
          setIsCourseModalOpen(false);
          fetchTeachingCourses();
        }
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Handle Delete Course
  const handleDeleteCourse = async (courseId) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn xóa khóa học này? Mọi tài liệu, bài tập và điểm số liên quan sẽ bị xóa vĩnh viễn!"
      )
    ) {
      return;
    }

    try {
      const res = await courseAPI.delete(courseId);
      if (res.success) {
        toast.success("Đã xóa khóa học thành công");
        fetchTeachingCourses();
        if (activeCourse?._id === courseId) setActiveCourse(null);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Handle Add Material
  const handleAddMaterial = async (e) => {
    e.preventDefault();
    try {
      const res = await courseAPI.addMaterial(activeCourse._id, materialForm);
      if (res.success) {
        toast.success("Đã thêm bài học/tài liệu mới!");
        setIsMaterialModalOpen(false);
        setMaterialForm({
          title: "",
          type: "video",
          videoUrl: "",
          fileUrl: "",
          content: "",
          duration: "15 phút",
        });
        // Refresh active course
        const refreshed = await courseAPI.getById(activeCourse._id);
        if (refreshed.success) setActiveCourse(refreshed.data);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Handle Delete Material
  const handleDeleteMaterial = async (materialId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tài liệu này?")) return;
    try {
      const res = await courseAPI.deleteMaterial(activeCourse._id, materialId);
      if (res.success) {
        toast.success("Đã xóa tài liệu bài học");
        const refreshed = await courseAPI.getById(activeCourse._id);
        if (refreshed.success) setActiveCourse(refreshed.data);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Handle Create Assignment
  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      const res = await assignmentAPI.create({
        ...assignmentForm,
        courseId: activeCourse._id,
      });
      if (res.success) {
        toast.success("Đã tạo bài tập mới thành công!");
        setIsAssignmentModalOpen(false);
        setAssignmentForm({
          title: "",
          description: "",
          deadline: "",
          maxScore: 10,
          attachmentUrl: "",
        });
        loadCourseDetails(activeCourse._id);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Handle Delete Assignment
  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm("Xóa bài tập này và toàn bộ bài nộp của học sinh?")) return;
    try {
      const res = await assignmentAPI.delete(assignmentId);
      if (res.success) {
        toast.success("Đã xóa bài tập thành công");
        loadCourseDetails(activeCourse._id);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Handle Grade Submission
  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await submissionAPI.grade(selectedSubmission._id, {
        score: gradeForm.score,
        feedback: gradeForm.feedback,
      });
      if (res.success) {
        toast.success("Đã chấm điểm và lưu nhận xét thành công!");
        setIsGradeModalOpen(false);
        loadCourseDetails(activeCourse._id);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="container" style={{ paddingTop: "30px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "6px" }}>
            Quản lý Giảng dạy & Lớp học
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            Tạo khóa học, tải lên tài liệu đa phương tiện, giao bài tập và chấm điểm học sinh.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCourse(null);
            setCourseForm({
              title: "",
              description: "",
              category: categories[0]?._id || "",
              thumbnail:
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
              level: "Cơ bản",
              status: "published",
            });
            setIsCourseModalOpen(true);
          }}
          className="btn btn-primary"
        >
          <Plus size={18} />
          <span>Tạo khóa học mới</span>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <p style={{ color: "var(--text-muted)" }}>Đang tải danh sách khóa học...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="card" style={{ padding: "60px 20px", textAlign: "center" }}>
          <BookOpen
            size={48}
            color="var(--text-muted)"
            style={{ margin: "0 auto 16px auto" }}
          />
          <h3 style={{ marginBottom: "8px" }}>Bạn chưa tạo khóa học nào</h3>
          <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
            Hãy bấm vào nút "Tạo khóa học mới" để bắt đầu mở lớp học đầu tiên của bạn!
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "320px 1fr",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {/* Left Column: My Courses List */}
          <div className="card" style={{ padding: "16px" }}>
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                padding: "8px 12px",
                marginBottom: "8px",
              }}
            >
              Các lớp học của bạn ({courses.length})
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {courses.map((c) => {
                const isSelected = activeCourse?._id === c._id;
                return (
                  <div
                    key={c._id}
                    onClick={() => setActiveCourse(c)}
                    style={{
                      padding: "12px",
                      borderRadius: "var(--radius-md)",
                      border: `1.5px solid ${
                        isSelected ? "var(--primary)" : "var(--border)"
                      }`,
                      background: isSelected ? "var(--primary-light)" : "#ffffff",
                      cursor: "pointer",
                      transition: "var(--transition)",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        color: isSelected ? "var(--primary-dark)" : "var(--text-main)",
                        marginBottom: "6px",
                      }}
                    >
                      {c.title}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.78rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      <span>
                        <Users size={12} style={{ display: "inline" }} /> {c.studentCount} sinh viên
                      </span>
                      <span>
                        <Award size={12} style={{ display: "inline" }} /> {c.assignmentCount} bài tập
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Management for Active Course */}
          {activeCourse && (
            <div className="card" style={{ padding: "28px" }}>
              {/* Active Course Banner */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: "20px",
                  marginBottom: "24px",
                }}
              >
                <div>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    <span className="badge badge-primary">
                      {activeCourse.category?.name || "Danh mục"}
                    </span>
                    <span className="badge badge-gray">{activeCourse.level}</span>
                  </div>
                  <h2 style={{ fontSize: "1.6rem", marginBottom: "6px" }}>
                    {activeCourse.title}
                  </h2>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    {activeCourse.description}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <Link
                    to={`/learn/${activeCourse._id}`}
                    className="btn btn-outline btn-sm"
                    title="Vào phòng học xem trước"
                  >
                    <Eye size={16} /> Xem lớp học
                  </Link>
                  <button
                    onClick={() => {
                      setEditingCourse(activeCourse);
                      setCourseForm({
                        title: activeCourse.title,
                        description: activeCourse.description,
                        category: activeCourse.category?._id || activeCourse.category,
                        thumbnail: activeCourse.thumbnail,
                        level: activeCourse.level,
                        status: activeCourse.status,
                      });
                      setIsCourseModalOpen(true);
                    }}
                    className="btn btn-outline btn-sm"
                    title="Sửa thông tin"
                  >
                    <Edit size={16} /> Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(activeCourse._id)}
                    className="btn btn-danger btn-sm"
                    title="Xóa khóa học"
                  >
                    <Trash2 size={16} /> Xóa
                  </button>
                </div>
              </div>

              {/* Management Tabs */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  borderBottom: "1px solid var(--border)",
                  marginBottom: "24px",
                }}
              >
                <button
                  onClick={() => setActiveTab("materials")}
                  style={{
                    padding: "10px 16px",
                    fontWeight: 600,
                    borderBottom: `2.5px solid ${
                      activeTab === "materials" ? "var(--primary)" : "transparent"
                    }`,
                    color:
                      activeTab === "materials"
                        ? "var(--primary)"
                        : "var(--text-muted)",
                  }}
                >
                  Tài liệu & Bài học ({activeCourse.materials?.length || 0})
                </button>

                <button
                  onClick={() => setActiveTab("assignments")}
                  style={{
                    padding: "10px 16px",
                    fontWeight: 600,
                    borderBottom: `2.5px solid ${
                      activeTab === "assignments" ? "var(--primary)" : "transparent"
                    }`,
                    color:
                      activeTab === "assignments"
                        ? "var(--primary)"
                        : "var(--text-muted)",
                  }}
                >
                  Bài tập ({courseAssignments.length})
                </button>

                <button
                  onClick={() => setActiveTab("students")}
                  style={{
                    padding: "10px 16px",
                    fontWeight: 600,
                    borderBottom: `2.5px solid ${
                      activeTab === "students" ? "var(--primary)" : "transparent"
                    }`,
                    color:
                      activeTab === "students"
                        ? "var(--primary)"
                        : "var(--text-muted)",
                  }}
                >
                  Sinh viên ghi danh ({courseStudents.length})
                </button>

                <button
                  onClick={() => setActiveTab("submissions")}
                  style={{
                    padding: "10px 16px",
                    fontWeight: 600,
                    borderBottom: `2.5px solid ${
                      activeTab === "submissions" ? "var(--primary)" : "transparent"
                    }`,
                    color:
                      activeTab === "submissions"
                        ? "var(--primary)"
                        : "var(--text-muted)",
                  }}
                >
                  Chấm điểm bài nộp ({allSubmissions.length})
                </button>
              </div>

              {/* Tab 1: Materials Management */}
              {activeTab === "materials" && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <h3 style={{ fontSize: "1.1rem" }}>Danh sách tài liệu học tập</h3>
                    <button
                      onClick={() => setIsMaterialModalOpen(true)}
                      className="btn btn-primary btn-sm"
                    >
                      <Plus size={16} /> Thêm tài liệu / bài học
                    </button>
                  </div>

                  {!activeCourse.materials || activeCourse.materials.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "30px 0" }}>
                      Chưa có tài liệu nào. Bấm nút phía trên để thêm PDF, video hoặc bài đọc.
                    </p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {activeCourse.materials.map((m, idx) => (
                        <div
                          key={m._id || idx}
                          style={{
                            padding: "14px 18px",
                            border: "1px solid var(--border)",
                            borderRadius: "var(--radius-md)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "6px",
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
                                justifyCenter: "center",
                              }}
                            >
                              {m.type === "video" && <Video size={16} style={{ margin: "auto" }} />}
                              {m.type === "pdf" && <FileText size={16} style={{ margin: "auto" }} />}
                              {m.type === "reading" && <BookOpen size={16} style={{ margin: "auto" }} />}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600 }}>{m.title}</div>
                              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                                {m.type.toUpperCase()} • {m.duration}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteMaterial(m._id)}
                            className="btn-icon"
                            style={{ color: "var(--danger)" }}
                            title="Xóa tài liệu"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Assignments Management */}
              {activeTab === "assignments" && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <h3 style={{ fontSize: "1.1rem" }}>Danh sách bài tập thực hành</h3>
                    <button
                      onClick={() => setIsAssignmentModalOpen(true)}
                      className="btn btn-primary btn-sm"
                    >
                      <Plus size={16} /> Tạo bài tập mới
                    </button>
                  </div>

                  {courseAssignments.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "30px 0" }}>
                      Chưa có bài tập nào. Hãy tạo bài tập để học sinh nộp bài và chấm điểm.
                    </p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {courseAssignments.map((a) => (
                        <div
                          key={a._id}
                          style={{
                            padding: "16px 20px",
                            border: "1px solid var(--border)",
                            borderRadius: "var(--radius-md)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "4px" }}>
                              {a.title}
                            </div>
                            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "8px" }}>
                              {a.description}
                            </p>
                            <div style={{ display: "flex", gap: "16px", fontSize: "0.82rem", color: "#b45309" }}>
                              <span>Hạn nộp: {new Date(a.deadline).toLocaleDateString("vi-VN")}</span>
                              <span>Điểm tối đa: {a.maxScore || 10}</span>
                              <span style={{ color: "var(--primary)" }}>
                                {a.submissionCount || 0} bài đã nộp
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteAssignment(a._id)}
                            className="btn-icon"
                            style={{ color: "var(--danger)" }}
                            title="Xóa bài tập"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Enrolled Students */}
              {activeTab === "students" && (
                <div>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "16px" }}>
                    Danh sách sinh viên đã ghi danh ({courseStudents.length})
                  </h3>

                  {courseStudents.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "30px 0" }}>
                      Chưa có sinh viên nào ghi danh khóa học này.
                    </p>
                  ) : (
                    <div className="table-container">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Sinh viên</th>
                            <th>Email</th>
                            <th>Ngày ghi danh</th>
                            <th>Tiến độ học</th>
                            <th>Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody>
                          {courseStudents.map((en) => (
                            <tr key={en._id}>
                              <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <img
                                  src={
                                    en.student?.avatar ||
                                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
                                  }
                                  alt=""
                                  style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                                />
                                <span style={{ fontWeight: 600 }}>{en.student?.name}</span>
                              </td>
                              <td style={{ color: "var(--text-muted)" }}>{en.student?.email}</td>
                              <td>{new Date(en.enrolledAt).toLocaleDateString("vi-VN")}</td>
                              <td style={{ width: "160px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <div className="progress-bar-bg" style={{ flex: 1 }}>
                                    <div
                                      className="progress-bar-fill"
                                      style={{ width: `${en.progress || 0}%` }}
                                    />
                                  </div>
                                  <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>
                                    {en.progress || 0}%
                                  </span>
                                </div>
                              </td>
                              <td>
                                <span
                                  className={`badge ${
                                    en.status === "completed" ? "badge-success" : "badge-primary"
                                  }`}
                                >
                                  {en.status === "completed" ? "Hoàn thành" : "Đang học"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Submissions & Grading */}
              {activeTab === "submissions" && (
                <div>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "16px" }}>
                    Chấm điểm bài tập của sinh viên ({allSubmissions.length})
                  </h3>

                  {allSubmissions.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "30px 0" }}>
                      Chưa có sinh viên nào nộp bài tập cho khóa học này.
                    </p>
                  ) : (
                    <div className="table-container">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Sinh viên</th>
                            <th>Bài tập</th>
                            <th>Thời gian nộp</th>
                            <th>Tệp / Bài làm</th>
                            <th>Điểm số</th>
                            <th>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allSubmissions.map((sub) => (
                            <tr key={sub._id}>
                              <td style={{ fontWeight: 600 }}>{sub.student?.name}</td>
                              <td style={{ color: "var(--text-main)" }}>{sub.assignmentTitle}</td>
                              <td style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                                {new Date(sub.submittedAt).toLocaleString("vi-VN")}
                              </td>
                              <td>
                                {sub.fileUrl ? (
                                  <a
                                    href={sub.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "4px",
                                      color: "var(--primary)",
                                      fontSize: "0.85rem",
                                    }}
                                  >
                                    <Download size={14} /> Tệp đính kèm
                                  </a>
                                ) : (
                                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                                    Văn bản
                                  </span>
                                )}
                              </td>
                              <td>
                                {sub.status === "graded" ? (
                                  <span className="badge badge-success">
                                    {sub.score} / {sub.maxScore || 10}
                                  </span>
                                ) : (
                                  <span className="badge badge-warning">Chờ chấm</span>
                                )}
                              </td>
                              <td>
                                <button
                                  onClick={() => {
                                    setSelectedSubmission(sub);
                                    setGradeForm({
                                      score: sub.score !== null ? sub.score : "",
                                      feedback: sub.feedback || "",
                                    });
                                    setIsGradeModalOpen(true);
                                  }}
                                  className="btn btn-outline btn-sm"
                                >
                                  {sub.status === "graded" ? "Sửa điểm" : "Chấm điểm"}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal: Create / Edit Course */}
      <Modal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        title={editingCourse ? "Chỉnh sửa khóa học" : "Tạo khóa học mới"}
      >
        <form onSubmit={handleSaveCourse}>
          <div className="form-group">
            <label className="form-label">Tiêu đề khóa học *</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="VD: Lập trình Web MERN Stack Chuyên sâu"
              value={courseForm.title}
              onChange={(e) =>
                setCourseForm({ ...courseForm, title: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mô tả khóa học *</label>
            <textarea
              required
              rows={4}
              className="form-textarea"
              placeholder="Mô tả nội dung, mục tiêu và kết quả đạt được sau khóa học..."
              value={courseForm.description}
              onChange={(e) =>
                setCourseForm({ ...courseForm, description: e.target.value })
              }
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Danh mục *</label>
              <select
                required
                className="form-select"
                value={courseForm.category}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, category: e.target.value })
                }
              >
                <option value="">Chọn danh mục</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Trình độ</label>
              <select
                className="form-select"
                value={courseForm.level}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, level: e.target.value })
                }
              >
                <option value="Cơ bản">Cơ bản</option>
                <option value="Trung cấp">Trung cấp</option>
                <option value="Nâng cao">Nâng cao</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Ảnh bìa (Thumbnail URL)</label>
            <input
              type="text"
              className="form-control"
              placeholder="https://images.unsplash.com/..."
              value={courseForm.thumbnail}
              onChange={(e) =>
                setCourseForm({ ...courseForm, thumbnail: e.target.value })
              }
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
            <button
              type="button"
              onClick={() => setIsCourseModalOpen(false)}
              className="btn btn-outline"
            >
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              {editingCourse ? "Lưu thay đổi" : "Tạo khóa học"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Material */}
      <Modal
        isOpen={isMaterialModalOpen}
        onClose={() => setIsMaterialModalOpen(false)}
        title="Thêm tài liệu / bài học vào khóa học"
      >
        <form onSubmit={handleAddMaterial}>
          <div className="form-group">
            <label className="form-label">Tiêu đề tài liệu / bài học *</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="VD: Bài 1: Giới thiệu Kiến trúc Hệ thống"
              value={materialForm.title}
              onChange={(e) =>
                setMaterialForm({ ...materialForm, title: e.target.value })
              }
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Loại tài liệu *</label>
              <select
                className="form-select"
                value={materialForm.type}
                onChange={(e) =>
                  setMaterialForm({ ...materialForm, type: e.target.value })
                }
              >
                <option value="video">Video bài giảng</option>
                <option value="pdf">Tài liệu PDF / Slide</option>
                <option value="reading">Bài đọc lý thuyết</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Thời lượng ước tính</label>
              <input
                type="text"
                className="form-control"
                placeholder="VD: 20 phút"
                value={materialForm.duration}
                onChange={(e) =>
                  setMaterialForm({ ...materialForm, duration: e.target.value })
                }
              />
            </div>
          </div>

          {materialForm.type === "video" && (
            <div className="form-group">
              <label className="form-label">Đường dẫn Video (YouTube Embed URL) *</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="VD: https://www.youtube.com/embed/..."
                value={materialForm.videoUrl}
                onChange={(e) =>
                  setMaterialForm({ ...materialForm, videoUrl: e.target.value })
                }
              />
            </div>
          )}

          {materialForm.type === "pdf" && (
            <div className="form-group">
              <label className="form-label">Tải lên tệp PDF hoặc dán link PDF:</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="form-control"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setUploadingMaterialFile(true);
                    try {
                      const res = await uploadAPI.uploadFile(file);
                      if (res.success) {
                        setMaterialForm((prev) => ({
                          ...prev,
                          fileUrl: res.data.url,
                        }));
                        toast.success("Tải tệp PDF lên máy chủ thành công!");
                      }
                    } catch (err) {
                      toast.error(err.message);
                    } finally {
                      setUploadingMaterialFile(false);
                    }
                  }
                }}
              />
              <input
                type="text"
                className="form-control"
                style={{ marginTop: "8px" }}
                placeholder="Hoặc nhập link trực tiếp: https://..."
                value={materialForm.fileUrl}
                onChange={(e) =>
                  setMaterialForm({ ...materialForm, fileUrl: e.target.value })
                }
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              {materialForm.type === "reading"
                ? "Nội dung bài đọc chi tiết *"
                : "Ghi chú tóm tắt bài học (Tùy chọn)"}
            </label>
            <textarea
              rows={6}
              required={materialForm.type === "reading"}
              className="form-textarea"
              placeholder="Soạn nội dung bài học..."
              value={materialForm.content}
              onChange={(e) =>
                setMaterialForm({ ...materialForm, content: e.target.value })
              }
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
            <button
              type="button"
              onClick={() => setIsMaterialModalOpen(false)}
              className="btn btn-outline"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={uploadingMaterialFile}
              className="btn btn-primary"
            >
              {uploadingMaterialFile ? "Đang tải tệp..." : "Lưu tài liệu"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Create Assignment */}
      <Modal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        title="Tạo bài tập mới"
      >
        <form onSubmit={handleCreateAssignment}>
          <div className="form-group">
            <label className="form-label">Tiêu đề bài tập *</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="VD: Bài tập 1: Xây dựng RESTful API và JWT"
              value={assignmentForm.title}
              onChange={(e) =>
                setAssignmentForm({ ...assignmentForm, title: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Yêu cầu đề bài *</label>
            <textarea
              required
              rows={5}
              className="form-textarea"
              placeholder="Mô tả cụ thể đề bài, các tiêu chí chấm điểm và định dạng nộp bài..."
              value={assignmentForm.description}
              onChange={(e) =>
                setAssignmentForm({
                  ...assignmentForm,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label className="form-label">Hạn nộp bài *</label>
              <input
                type="datetime-local"
                required
                className="form-control"
                value={assignmentForm.deadline}
                onChange={(e) =>
                  setAssignmentForm({
                    ...assignmentForm,
                    deadline: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Điểm tối đa</label>
              <input
                type="number"
                min="1"
                max="100"
                className="form-control"
                value={assignmentForm.maxScore}
                onChange={(e) =>
                  setAssignmentForm({
                    ...assignmentForm,
                    maxScore: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
            <button
              type="button"
              onClick={() => setIsAssignmentModalOpen(false)}
              className="btn btn-outline"
            >
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              Tạo bài tập
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Grade Submission */}
      <Modal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        title="Chấm điểm & Nhận xét bài nộp"
      >
        {selectedSubmission && (
          <form onSubmit={handleGradeSubmit}>
            <div
              style={{
                padding: "14px",
                background: "var(--bg-subtle)",
                borderRadius: "var(--radius-md)",
                marginBottom: "18px",
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: "4px" }}>
                Sinh viên: {selectedSubmission.student?.name} ({selectedSubmission.student?.email})
              </div>
              <div style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
                Bài tập: {selectedSubmission.assignmentTitle}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Nội dung bài làm của sinh viên:</label>
              <div
                style={{
                  padding: "12px",
                  background: "#ffffff",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  minHeight: "80px",
                  whiteSpace: "pre-wrap",
                  fontSize: "0.9rem",
                }}
              >
                {selectedSubmission.submissionText || "Không có văn bản."}
              </div>
            </div>

            {selectedSubmission.fileUrl && (
              <div className="form-group">
                <label className="form-label">Tệp bài làm đính kèm:</label>
                <a
                  href={selectedSubmission.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  <Download size={16} /> Tải về kiểm tra ({selectedSubmission.fileName || "File bài làm"})
                </a>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                Điểm số (Thang điểm 0 - {selectedSubmission.maxScore || 10}) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max={selectedSubmission.maxScore || 10}
                required
                className="form-control"
                placeholder="Nhập điểm..."
                value={gradeForm.score}
                onChange={(e) =>
                  setGradeForm({ ...gradeForm, score: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Lời phê & Nhận xét của giảng viên:</label>
              <textarea
                rows={4}
                className="form-textarea"
                placeholder="Nhận xét ưu điểm, nhược điểm và hướng khắc phục..."
                value={gradeForm.feedback}
                onChange={(e) =>
                  setGradeForm({ ...gradeForm, feedback: e.target.value })
                }
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
              <button
                type="button"
                onClick={() => setIsGradeModalOpen(false)}
                className="btn btn-outline"
              >
                Hủy
              </button>
              <button type="submit" className="btn btn-primary">
                Lưu kết quả chấm điểm
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default TeacherDashboard;
