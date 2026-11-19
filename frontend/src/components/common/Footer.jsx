import React from "react";
import { GraduationCap, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer
      style={{
        background: "#ffffff",
        borderTop: "1px solid var(--border)",
        padding: "40px 0 24px 0",
        marginTop: "60px",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "30px",
            marginBottom: "30px",
          }}
        >
          <div style={{ maxWidth: "380px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontWeight: 800,
                fontSize: "1.2rem",
                color: "var(--primary)",
                marginBottom: "12px",
              }}
            >
              <GraduationCap size={26} />
              <span>EduLearn Classroom</span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Nền tảng quản lý học tập trực tuyến thông minh (Online Classroom), hỗ trợ
              giảng viên tổ chức khóa học, đăng tải tài liệu đa phương tiện và chấm điểm
              bài tập một cách trực quan, hiệu quả.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: "0.95rem", marginBottom: "12px" }}>
              Công nghệ ứng dụng (MERN)
            </h4>
            <ul
              style={{
                listStyle: "none",
                fontSize: "0.88rem",
                color: "var(--text-muted)",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <li>• MongoDB & Mongoose Schema</li>
              <li>• Express.js RESTful API & JWT</li>
              <li>• React.js & Modern Hooks & Context</li>
              <li>• Node.js Backend Server</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: "0.95rem", marginBottom: "12px" }}>
              Vai trò người dùng (Roles)
            </h4>
            <ul
              style={{
                listStyle: "none",
                fontSize: "0.88rem",
                color: "var(--text-muted)",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <li>• Admin: Quản lý người dùng, Danh mục & Thống kê</li>
              <li>• Teacher: Tạo khóa học, Đăng tài liệu, Chấm bài</li>
              <li>• Student: Ghi danh, Học bài, Nộp bài tập</li>
            </ul>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "20px",
            textAlign: "center",
            fontSize: "0.85rem",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          <span>Đề tài Tiểu luận Cuối kỳ Môn Lập trình Web - MERN Stack © 2026</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
