const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const User = require("../models/User");
const Category = require("../models/Category");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");

const seedData = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/online_classroom";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Course.deleteMany();
    await Enrollment.deleteMany();
    await Assignment.deleteMany();
    await Submission.deleteMany();

    console.log("Cleared old database records.");

    // 1. Create Users
    const admin = await User.create({
      name: "Quản trị viên Hệ thống",
      email: "admin@classroom.edu.vn",
      password: "password123",
      role: "admin",
      isActive: true,
      bio: "Quản trị viên cấp cao nền tảng Online Classroom",
      phone: "0901234567",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    });

    const teacher1 = await User.create({
      name: "TS. Nguyễn Văn An",
      email: "teacher1@classroom.edu.vn",
      password: "password123",
      role: "teacher",
      isActive: true,
      bio: "Tiến sĩ Khoa học Máy tính, 10 năm kinh nghiệm giảng dạy Web & Hệ thống phân tán",
      phone: "0912345678",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    });

    const teacher2 = await User.create({
      name: "ThS. Trần Thị Mai",
      email: "teacher2@classroom.edu.vn",
      password: "password123",
      role: "teacher",
      isActive: true,
      bio: "Thạc sĩ Khoa học Dữ liệu, Chuyên gia AI & Machine Learning ứng dụng",
      phone: "0923456789",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    });

    const student1 = await User.create({
      name: "Lê Hoàng Nam",
      email: "student1@classroom.edu.vn",
      password: "password123",
      role: "student",
      isActive: true,
      bio: "Sinh viên năm 3 ngành Công nghệ Thông tin",
      phone: "0934567890",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    });

    const student2 = await User.create({
      name: "Nguyễn Thu Hà",
      email: "student2@classroom.edu.vn",
      password: "password123",
      role: "student",
      isActive: true,
      bio: "Sinh viên năm 2 đam mê Lập trình Web và UI/UX",
      phone: "0945678901",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    });

    const student3 = await User.create({
      name: "Trần Quang Huy (Đã bị khóa)",
      email: "blocked@classroom.edu.vn",
      password: "password123",
      role: "student",
      isActive: false, // Locked test account
      bio: "Tài khoản thử nghiệm kiểm tra tính năng khóa/mở khóa",
      phone: "0956789012",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    });

    console.log("Created 6 users (1 Admin, 2 Teachers, 3 Students).");

    // 2. Create Categories
    const catWeb = await Category.create({
      name: "Lập trình Web & Mobile",
      slug: "lap-trinh-web-mobile",
      description: "Khóa học React, Node.js, Express, MongoDB, Next.js và phát triển ứng dụng di động",
      icon: "Code",
    });

    const catAI = await Category.create({
      name: "Trí tuệ Nhân tạo & Data",
      slug: "tri-tue-nhan-tao-data",
      description: "Machine Learning, Deep Learning, Phân tích dữ liệu với Python và thị giác máy tính",
      icon: "Cpu",
    });

    const catDB = await Category.create({
      name: "Cơ sở Dữ liệu & Cloud",
      slug: "co-so-du-lieu-cloud",
      description: "MongoDB NoSQL, SQL Server, PostgreSQL, Docker và triển khai ứng dụng đám mây",
      icon: "Database",
    });

    const catAlgo = await Category.create({
      name: "Thuật toán & Cấu trúc Dữ liệu",
      slug: "thuat-toan-cau-truc-du-lieu",
      description: "Nền tảng tư duy lập trình, giải thuật nâng cao và luyện thi phỏng vấn kỹ thuật",
      icon: "Layers",
    });

    console.log("Created 4 categories.");

    // 3. Create Courses with Materials
    const course1 = await Course.create({
      title: "Lập trình Web MERN Stack Chuyên sâu 2026",
      description:
        "Khóa học toàn diện hướng dẫn xây dựng ứng dụng web hiện đại từ đầu đến cuối với MongoDB, Express.js, React.js và Node.js. Bạn sẽ học cách thiết kế RESTful API chuẩn mực, xác thực JWT phân quyền, quản lý state tập trung và triển khai production.",
      category: catWeb._id,
      teacher: teacher1._id,
      thumbnail:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
      level: "Trung cấp",
      status: "published",
      materials: [
        {
          title: "Bài 1: Giới thiệu Kiến trúc Hệ thống MERN Stack",
          type: "video",
          videoUrl: "https://www.youtube.com/embed/7CqJlxBYj-M",
          content: "Tổng quan về Single Page Application (SPA), Client-Server architecture và luồng trao đổi dữ liệu REST API giữa React và Express.",
          duration: "25 phút",
          order: 1,
        },
        {
          title: "Bài 2: Tài liệu Slide Kiến trúc Mongoose Schema & Database Design",
          type: "pdf",
          fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          content: "Bộ slide chi tiết về cách thiết kế Schema, Virtuals, Pre/Post hooks và quan hệ Reference trong Mongoose.",
          duration: "30 phút",
          order: 2,
        },
        {
          title: "Bài 3: Bài đọc Chuyên sâu - Xử lý Xác thực JWT & Bảo mật API",
          type: "reading",
          content:
            "## Bảo mật trong MERN Stack\n\n### 1. JSON Web Token (JWT)\nJWT gồm 3 phần:\n- **Header**: Thuật toán ký (e.g. HS256)\n- **Payload**: Thông tin định danh người dùng (userId, role)\n- **Signature**: Chữ ký bảo mật với secret key\n\n### 2. Các nguyên tắc vàng:\n- Không lưu thông tin nhạy cảm vào Payload.\n- Mã hóa mật khẩu bằng `bcryptjs` với salt rounds >= 10.\n- Sử dụng Middleware `authMiddleware` để kiểm tra `Bearer token` trên từng request private.\n- Thiết lập CORS đúng nguồn cấp phép.",
          duration: "20 phút",
          order: 3,
        },
      ],
    });

    const course2 = await Course.create({
      title: "Thiết kế & Tối ưu Cơ sở Dữ liệu MongoDB Thực chiến",
      description:
        "Nắm vững kỹ thuật lập chỉ mục (Indexes), Aggregation Pipeline, tối ưu truy vấn dữ liệu lớn và kiến trúc phân cụm Replica Set trên MongoDB Atlas.",
      category: catDB._id,
      teacher: teacher1._id,
      thumbnail:
        "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=60",
      level: "Nâng cao",
      status: "published",
      materials: [
        {
          title: "Bài 1: Chỉ mục B-Tree & Chiến lược tối ưu hóa Index trong MongoDB",
          type: "video",
          videoUrl: "https://www.youtube.com/embed/2vM_GfL4108",
          content: "Tìm hiểu cách MongoDB sử dụng Compound Index và Single Field Index để giảm Execution Time từ 500ms xuống còn 2ms.",
          duration: "35 phút",
          order: 1,
        },
        {
          title: "Bài 2: Cẩm nang thực hành MongoDB Aggregation Framework",
          type: "pdf",
          fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          content: "Tài liệu thực hành $match, $group, $lookup, $unwind và $project.",
          duration: "40 phút",
          order: 2,
        },
      ],
    });

    const course3 = await Course.create({
      title: "Nhập môn Machine Learning & Data Science với Python",
      description:
        "Bắt đầu hành trình Trí tuệ Nhân tạo từ con số 0. Làm quen với Numpy, Pandas, Scikit-Learn và xây dựng các mô hình phân loại (Classification), dự báo (Regression) ứng dụng thực tế.",
      category: catAI._id,
      teacher: teacher2._id,
      thumbnail:
        "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop&q=60",
      level: "Cơ bản",
      status: "published",
      materials: [
        {
          title: "Bài 1: Tổng quan Học có giám sát (Supervised Learning)",
          type: "video",
          videoUrl: "https://www.youtube.com/embed/ukzFI9rgwfU",
          content: "Hiểu rõ sự khác biệt giữa Phân loại và Hồi quy, hàm mất mát (Loss Function) và Gradient Descent.",
          duration: "30 phút",
          order: 1,
        },
        {
          title: "Bài 2: Bài đọc - Các bước tiền xử lý dữ liệu chuẩn công nghiệp",
          type: "reading",
          content:
            "## Quy trình Tiền xử lý Dữ liệu\n\n1. **Khám phá Dữ liệu (EDA)**: Kiểm tra phân phối, giá trị thiếu (missing values) và ngoại lai (outliers).\n2. **Xử lý giá trị trống**: Imputation bằng Mean, Median hoặc KNN Imputer.\n3. **Mã hóa biến phân loại**: One-Hot Encoding hoặc Label Encoding.\n4. **Chuẩn hóa thang đo**: StandardScaler hoặc MinMaxScaler.",
          duration: "25 phút",
          order: 2,
        },
      ],
    });

    console.log("Created 3 rich courses with materials.");

    // 4. Create Assignments
    const assignment1 = await Assignment.create({
      course: course1._id,
      teacher: teacher1._id,
      title: "Bài tập 1: Xây dựng RESTful API CRUD và Xác thực JWT",
      description:
        "Sinh viên hãy thiết kế các endpoint CRUD cho tài nguyên Course và User. Yêu cầu có middleware kiểm tra role admin/teacher/student và mã hóa mật khẩu trước khi lưu vào MongoDB. Nộp link github hoặc file zip mã nguồn.",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days ahead
      maxScore: 10,
    });

    const assignment2 = await Assignment.create({
      course: course1._id,
      teacher: teacher1._id,
      title: "Bài tập 2: Tích hợp Giao diện React & Quản lý State bằng Context API",
      description:
        "Xây dựng các màn hình Đăng ký, Đăng nhập, Danh sách khóa học và Chi tiết khóa học. Sử dụng React Context để lưu trữ token đăng nhập và trạng thái người dùng hiện tại.",
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days ahead
      maxScore: 10,
    });

    const assignment3 = await Assignment.create({
      course: course3._id,
      teacher: teacher2._id,
      title: "Bài tập thực hành: Phân tích Dữ liệu Titanic với Pandas & Scikit-learn",
      description:
        "Tải tập dữ liệu Titanic, làm sạch dữ liệu và huấn luyện mô hình Logistic Regression dự đoán khả năng sống sót. Yêu cầu tính toán độ chính xác (Accuracy, F1-Score).",
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      maxScore: 10,
    });

    console.log("Created 3 assignments.");

    // 5. Create Enrollments
    const enrollment1 = await Enrollment.create({
      course: course1._id,
      student: student1._id,
      enrolledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      completedMaterials: [course1.materials[0]._id],
      progress: 33,
      status: "active",
    });

    const enrollment2 = await Enrollment.create({
      course: course1._id,
      student: student2._id,
      enrolledAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      completedMaterials: [
        course1.materials[0]._id,
        course1.materials[1]._id,
        course1.materials[2]._id,
      ],
      progress: 100,
      status: "completed",
    });

    const enrollment3 = await Enrollment.create({
      course: course3._id,
      student: student1._id,
      enrolledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      completedMaterials: [course3.materials[0]._id],
      progress: 50,
      status: "active",
    });

    console.log("Created 3 enrollments.");

    // 6. Create Submissions
    // Student 1 submitted Assignment 1 and it is graded
    await Submission.create({
      assignment: assignment1._id,
      course: course1._id,
      student: student1._id,
      submissionText:
        "Em đã hoàn thành đầy đủ các endpoint theo chuẩn RESTful API, có hash password bằng bcrypt và middleware xác thực JWT với đầy đủ phân quyền 3 roles. Link repo: https://github.com/student1/mern-classroom-api",
      fileUrl: "",
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      score: 9.5,
      feedback:
        "Code tổ chức rất chuẩn MVC, tách routes và controllers rõ ràng. Error handling rất tốt. Tiếp tục phát huy!",
      gradedBy: teacher1._id,
      gradedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: "graded",
    });

    // Student 2 submitted Assignment 1 (pending grade)
    await Submission.create({
      assignment: assignment1._id,
      course: course1._id,
      student: student2._id,
      submissionText:
        "Dạ thưa Thầy, em gửi bài làm gồm source code backend API và tài liệu kiểm thử Postman đính kèm.",
      fileUrl: "",
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: "submitted",
    });

    console.log("Created sample submissions.");
    console.log("🎉 Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedData();
