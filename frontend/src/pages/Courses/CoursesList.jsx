import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { courseAPI, categoryAPI } from "../../services/api";
import {
  Search,
  BookOpen,
  Users,
  Filter,
  Layers,
  ArrowRight,
} from "lucide-react";

const CoursesList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [selectedLevel, setSelectedLevel] = useState(
    searchParams.get("level") || ""
  );

  useEffect(() => {
    categoryAPI
      .getAll()
      .then((res) => {
        if (res.success) setCategories(res.data || []);
      })
      .catch((err) => console.error(err));
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (keyword) params.keyword = keyword;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedLevel) params.level = selectedLevel;

      const res = await courseAPI.getAll(params);
      if (res.success) {
        setCourses(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, selectedLevel]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  return (
    <div className="container" style={{ paddingTop: "40px" }}>
      {/* Page Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "2.2rem", marginBottom: "8px" }}>
          Khám phá Lớp học Trực tuyến
        </h1>
        <p style={{ color: "var(--text-muted)" }}>
          Tìm kiếm và ghi danh vào các khóa học chất lượng từ giảng viên hàng đầu.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: "20px",
          marginBottom: "32px",
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <form
          onSubmit={handleSearchSubmit}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flex: 1,
            minWidth: "280px",
          }}
        >
          <div style={{ position: "relative", width: "100%" }}>
            <Search
              size={18}
              color="var(--text-muted)"
              style={{ position: "absolute", left: "14px", top: "12px" }}
            />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khóa học hoặc nội dung..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="form-control"
              style={{ paddingLeft: "42px" }}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Tìm kiếm
          </button>
        </form>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-select"
            style={{ width: "auto", minWidth: "180px" }}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="form-select"
            style={{ width: "auto" }}
          >
            <option value="">Tất cả trình độ</option>
            <option value="Cơ bản">Cơ bản</option>
            <option value="Trung cấp">Trung cấp</option>
            <option value="Nâng cao">Nâng cao</option>
          </select>

          {(keyword || selectedCategory || selectedLevel) && (
            <button
              onClick={() => {
                setKeyword("");
                setSelectedCategory("");
                setSelectedLevel("");
              }}
              className="btn btn-outline"
            >
              Đặt lại
            </button>
          )}
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <p style={{ color: "var(--text-muted)" }}>Đang tìm kiếm khóa học...</p>
        </div>
      ) : courses.length === 0 ? (
        <div
          className="card"
          style={{ textAlign: "center", padding: "60px 20px" }}
        >
          <BookOpen
            size={48}
            color="var(--text-muted)"
            style={{ margin: "0 auto 16px auto" }}
          />
          <h3 style={{ marginBottom: "8px" }}>Không tìm thấy khóa học phù hợp</h3>
          <p style={{ color: "var(--text-muted)" }}>
            Hãy thử tìm kiếm với từ khóa khác hoặc bỏ các bộ lọc để xem toàn bộ danh sách.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="card"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div style={{ position: "relative", height: "180px" }}>
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <span
                  className="badge badge-primary"
                  style={{ position: "absolute", top: "12px", left: "12px" }}
                >
                  {course.category?.name || "Khóa học"}
                </span>
                <span
                  className="badge badge-gray"
                  style={{ position: "absolute", top: "12px", right: "12px" }}
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
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Users size={14} /> {course.studentCount || 0}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <BookOpen size={14} /> {course.materialCount || 0} bài
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/courses/${course._id}`}
                    className="btn btn-outline"
                    style={{ width: "100%" }}
                  >
                    Xem chi tiết & Ghi danh
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesList;
