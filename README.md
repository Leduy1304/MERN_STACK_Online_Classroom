# HỆ THỐNG LỚP HỌC TRỰC TUYẾN (ONLINE CLASSROOM)
> **BÁO CÁO TIỂU LUẬN CUỐI KỲ - MÔN LẬP TRÌNH WEB (MERN STACK)**  
> **Chủ đề:** Xây dựng Hệ thống Lớp học Trực tuyến (Online Classroom)  
> **Công nghệ:** MongoDB, Express.js, React.js, Node.js

---

## 1. TỔNG QUAN HỆ THỐNG & ĐẶC TÍNH NỔI BẬT

Hệ thống **Online Classroom (EduLearn)** là một nền tảng học tập trực tuyến toàn diện, kết nối Giảng viên và Sinh viên với sự quản trị tập trung của Admin:
- **Xác thực & Phân quyền bảo mật:** Sử dụng **JSON Web Token (JWT)**, mã hóa mật khẩu một chiều với **bcryptjs**, phân chia nghiêm ngặt 3 vai trò: `Admin`, `Teacher`, `Student`.
- **Hỗ trợ Đa phương tiện:** Giảng viên đăng tải bài giảng Video (nhúng YouTube), tài liệu PDF/Slide (hỗ trợ đọc trực tiếp và tải về), và bài đọc lý thuyết chuyên sâu.
- **Tương tác Bài tập & Chấm điểm 2 chiều:** Sinh viên nộp bài tập (văn bản / đính kèm tệp tin qua Multer) và giảng viên trực tiếp chấm điểm, ghi nhận xét lời phê.
- **Tiến trình học tập thông minh (Progress Tracking):** Sinh viên đánh dấu hoàn thành bài học, hệ thống tự động tính toán tỷ lệ % hoàn thành khóa học theo thời gian thực.
- **Quản trị người dùng & Danh mục:** Admin có quyền Khóa/Mở khóa tài khoản, phân lại quyền (Role), quản lý danh mục và giám sát toàn bộ khóa học.
- **Nút chuyển nhanh tài khoản Demo (1-Click Switcher):** Giúp thầy cô / hội đồng chấm thi dễ dàng đăng nhập và kiểm thử mọi vai trò chỉ bằng 1 cú click chuột!

---

## 2. TÀI KHOẢN TRẢI NGHIỆM HỆ THỐNG (TEST ACCOUNTS)

Hệ thống đã được tích hợp sẵn bộ dữ liệu mẫu thực tế thông qua Database Seeder:

| Vai trò | Email đăng nhập | Mật khẩu | Mô tả quyền hạn |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@classroom.edu.vn` | `password123` | Quản lý người dùng (Khóa/Mở khóa), phân quyền, quản lý danh mục, xem thống kê toàn hệ thống. |
| **Giảng viên (Teacher 1)** | `teacher1@classroom.edu.vn` | `password123` | TS. Nguyễn Văn An - Tạo và quản lý khóa học, thêm tài liệu, tạo bài tập, xem sinh viên ghi danh và chấm điểm. |
| **Giảng viên (Teacher 2)** | `teacher2@classroom.edu.vn` | `password123` | ThS. Trần Thị Mai - Giảng viên Khoa học Dữ liệu & AI. |
| **Sinh viên (Student 1)** | `student1@classroom.edu.vn` | `password123` | Lê Hoàng Nam - Ghi danh khóa học, học bài, nộp bài tập, theo dõi tiến độ. |
| **Sinh viên (Student 2)** | `student2@classroom.edu.vn` | `password123` | Nguyễn Thu Hà - Sinh viên ngành Lập trình Web. |
| **Tài khoản bị khóa** | `blocked@classroom.edu.vn` | `password123` | Tài khoản đã bị Admin khóa để kiểm thử tính năng bảo mật ngăn chặn truy cập. |

> **Mẹo:** Trên thanh điều hướng (Navbar) có nút **"Demo Role"**, bạn chỉ cần bấm vào và chọn vai trò mong muốn để hệ thống tự động đăng nhập ngay lập tức!

---

## 3. HƯỚNG DẪN KHỞI CHẠY DỰ ÁN

### Bước 1: Khởi động MongoDB
Đảm bảo MongoDB Server đang chạy trên máy tính (`mongodb://127.0.0.1:27017`).

### Bước 2: Cài đặt dependencies
Tại thư mục gốc của dự án, mở Terminal và chạy lệnh:

npm install


### Bước 3: Khởi tạo dữ liệu mẫu (Seeder)
Tại thư mục gốc `ReactProjects`, mở Terminal và chạy lệnh:
```bash
npm run seed
# Hoặc: cd backend && npm run seed
```
Lệnh trên sẽ tự động tạo sẵn các tài khoản mẫu, danh mục, khóa học, bài học video/pdf, bài tập và bài nộp đã chấm điểm.

### Bước 4: Khởi chạy Backend và Frontend

**Khởi chạy Backend (Port 5000):**
```bash
npm run server
# Hoặc: cd backend && npm run dev
```
Backend sẽ chạy tại: `http://localhost:5000`

**Khởi chạy Frontend (Port 5173):**
Mở một cửa sổ Terminal mới:
```bash
npm run client
# Hoặc: cd frontend && npm run dev
```
Frontend sẽ chạy tại: `http://localhost:5173`

---

## 4. KIẾN TRÚC MÃ NGUỒN (MERN STACK)

```
ReactProjects/
├── package.json                   # Scripts điều khiển toàn bộ dự án
├── backend/                       # Node.js + Express RESTful API Server
│   ├── .env                       # Cấu hình biến môi trường (PORT, MONGO_URI, JWT_SECRET)
│   ├── index.js                   # Điểm khởi chạy ứng dụng Express
│   ├── config/
│   │   └── db.js                  # Kết nối MongoDB qua Mongoose
│   ├── models/                    # Mongoose Schemas & Models
│   │   ├── User.js                # Quản lý người dùng, role, hash password
│   │   ├── Category.js            # Danh mục khóa học
│   │   ├── Course.js              # Khóa học & tài liệu bài giảng (PDF, Video, Reading)
│   │   ├── Assignment.js          # Bài tập thực hành & hạn nộp
│   │   ├── Enrollment.js          # Lượt ghi danh & tiến trình hoàn thành
│   │   └── Submission.js          # Bài nộp sinh viên & điểm số/lời phê
│   ├── controllers/               # Xử lý logic nghiệp vụ
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   ├── courseController.js
│   │   ├── assignmentController.js
│   │   ├── submissionController.js
│   │   ├── enrollmentController.js
│   │   └── adminController.js
│   ├── routes/                    # API Route Endpoints
│   │   ├── auth.js
│   │   ├── categories.js
│   │   ├── courses.js
│   │   ├── assignments.js
│   │   ├── submissions.js
│   │   ├── enrollments.js
│   │   ├── admin.js
│   │   └── upload.js
│   ├── middlewares/               # Middlewares xác thực và xử lý lỗi
│   │   ├── authMiddleware.js      # Xác thực JWT Bearer token & kiểm tra phân quyền (RBAC)
│   │   ├── uploadMiddleware.js    # Cấu hình Multer tải lên file PDF, Doc, Zip
│   │   └── errorMiddleware.js     # Xử lý lỗi tập trung chuẩn JSON
│   ├── utils/
│   │   ├── generateToken.js       # Ký JWT Token với thời hạn 30 ngày
│   │   └── seeder.js              # Script khởi tạo cơ sở dữ liệu mẫu phong phú
│   └── uploads/                   # Thư mục lưu trữ tệp tin tĩnh do người dùng tải lên
│
└── frontend/                      # React.js Single Page Application (Vite)
    ├── index.html                 # HTML Root với Plus Jakarta Sans Font
    ├── vite.config.js             # Cấu hình Vite & Proxy chuyển tiếp /api
    └── src/
        ├── App.jsx                # Root Component bao bọc Auth & Toast Providers
        ├── main.jsx               # React DOM Entry
        ├── services/
        │   └── api.js             # Axios Client & Interceptor tự động gắn JWT
        ├── context/
        │   ├── AuthContext.jsx    # Quản lý trạng thái xác thực và vai trò toàn cục
        │   └── ToastContext.jsx   # Hệ thống thông báo Pop-up trực quan
        ├── styles/
        │   └── global.css         # Hệ thống Design System, CSS Variables, Typography & Grid
        ├── layouts/
        │   └── MainLayout.jsx     # Layout chính gồm Header, Content, Footer
        ├── components/
        │   └── common/
        │       ├── Navbar.jsx     # Navigation bar kèm Demo 1-Click Role Switcher
        │       ├── Footer.jsx     # Footer thông tin đề tài tiểu luận
        │       ├── ProtectedRoute.jsx # Bảo vệ tuyến đường theo Role
        │       └── Modal.jsx      # Hộp thoại pop-up tái sử dụng
        ├── pages/
        │   ├── Home/              # Trang chủ, Banner, Danh mục, Khóa học nổi bật
        │   ├── Courses/           # Khám phá khóa học & Chi tiết khóa học & Phòng học trực tuyến
        │   ├── Teacher/           # Bảng quản lý khóa học, bài tập, chấm điểm của giảng viên
        │   ├── Student/           # Khóa học của tôi & theo dõi tiến độ
        │   ├── Admin/             # Bảng điều khiển quản trị người dùng, khóa tài khoản, danh mục
        │   ├── Auth/              # Trang Đăng nhập & Đăng ký
        │   └── Profile/           # Xem/Sửa hồ sơ & Đổi mật khẩu
        └── routes/
            └── AppRoutes.jsx      # Định tuyến các trang ứng dụng với React Router v7
```

---

## 5. DANH SÁCH RESTFUL API ENDPOINTS

### 1. Xác thực & Hồ sơ cá nhân (`/api/auth`)
- `POST /api/auth/register` - Đăng ký tài khoản mới (Student / Teacher).
- `POST /api/auth/login` - Đăng nhập nhận JWT Token.
- `GET /api/auth/me` - Lấy thông tin tài khoản đang đăng nhập (Private).
- `PUT /api/auth/profile` - Cập nhật thông tin cá nhân (Private).
- `PUT /api/auth/change-password` - Đổi mật khẩu (Private).

### 2. Khóa học & Bài học (`/api/courses`)
- `GET /api/courses` - Xem danh sách khóa học (Tìm kiếm theo từ khóa, lọc danh mục, trình độ).
- `GET /api/courses/:id` - Xem chi tiết khóa học và giáo trình.
- `GET /api/courses/teacher/my-courses` - Danh sách khóa học do giảng viên phụ trách (Teacher).
- `POST /api/courses` - Tạo khóa học mới (Teacher, Admin).
- `PUT /api/courses/:id` - Cập nhật thông tin khóa học (Teacher, Admin).
- `DELETE /api/courses/:id` - Xóa khóa học (Teacher, Admin).
- `POST /api/courses/:id/materials` - Đăng tải tài liệu (Video, PDF, Bài đọc) vào khóa học (Teacher).
- `DELETE /api/courses/:id/materials/:materialId` - Xóa tài liệu bài học (Teacher).

### 3. Ghi danh & Tiến trình học tập (`/api/enrollments`)
- `POST /api/enrollments/:courseId` - Ghi danh vào lớp học (Student).
- `GET /api/enrollments/my-courses` - Danh sách khóa học sinh viên đã ghi danh kèm tiến độ % (Student).
- `GET /api/enrollments/check/:courseId` - Kiểm tra trạng thái ghi danh của sinh viên.
- `PUT /api/enrollments/:courseId/progress` - Đánh dấu hoàn thành bài học và cập nhật tiến độ % (Student).
- `GET /api/enrollments/course/:courseId/students` - Xem danh sách sinh viên ghi danh trong lớp (Teacher, Admin).

### 4. Bài tập & Chấm điểm (`/api/assignments` & `/api/submissions`)
- `POST /api/assignments` - Tạo bài tập có hạn nộp và điểm tối đa (Teacher, Admin).
- `GET /api/assignments/course/:courseId` - Lấy danh sách bài tập của một khóa học.
- `DELETE /api/assignments/:id` - Xóa bài tập (Teacher, Admin).
- `POST /api/submissions/:assignmentId` - Nộp bài tập dạng văn bản hoặc tệp tin (Student).
- `GET /api/submissions/my/:assignmentId` - Xem bài nộp và điểm số của sinh viên (Student).
- `GET /api/submissions/assignment/:assignmentId` - Xem danh sách bài nộp của cả lớp (Teacher, Admin).
- `PUT /api/submissions/:id/grade` - Chấm điểm (thang điểm 10) và để lại nhận xét (Teacher, Admin).

### 5. Quản trị hệ thống (`/api/admin`)
- `GET /api/admin/stats` - Báo cáo thống kê tổng quan (Users, Teachers, Students, Courses, Enrollments, Submissions).
- `GET /api/admin/users` - Danh sách toàn bộ người dùng kèm bộ lọc tìm kiếm.
- `PUT /api/admin/users/:id/toggle-status` - Khóa / Mở khóa tài khoản người dùng.
- `PUT /api/admin/users/:id/role` - Phân quyền vai trò người dùng (Admin, Teacher, Student).
- `DELETE /api/admin/users/:id` - Xóa tài khoản người dùng.

### 6. Danh mục (`/api/categories`)
- `GET /api/categories` - Danh sách danh mục kèm số lượng khóa học liên kết.
- `POST /api/categories` - Tạo danh mục mới (Admin).
- `PUT /api/categories/:id` - Sửa danh mục (Admin).
- `DELETE /api/categories/:id` - Xóa danh mục (Admin).

### 7. Tải lên tệp tin (`/api/upload`)
- `POST /api/upload` - Tải lên tệp tin tài liệu PDF, hình ảnh, file nén zip bài nộp (Multer).

---

## 6. ĐÁP ỨNG ĐẦY ĐỦ TIÊU CHÍ ĐỀ BÀI

1. **Chủ đề Hệ thống Lớp học Trực tuyến:** Đã triển khai hoàn chỉnh luồng nghiệp vụ tạo lớp, phân phối tài liệu, ghi danh học tập, nộp bài và chấm điểm.
2. **Công nghệ bắt buộc MERN:**
   - **M**ongoDB: Thiết kế lược đồ Schema quan hệ chặt chẽ bằng Mongoose (`Users`, `Courses`, `Categories`, `Enrollments`, `Assignments`, `Submissions`).
   - **E**xpress.js: Kiến trúc RESTful API module hóa, xử lý lỗi trung tâm, middleware JWT RBAC.
   - **R**eact.js: Functional Components, Custom Hooks, Centralized State Management bằng React Context (AuthContext, ToastContext), giao diện Responsive đẹp mắt.
   - **N**ode.js: Nền tảng thực thi server mạnh mẽ, tích hợp Multer và bảo mật.
