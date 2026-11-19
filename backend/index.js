const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

// Load env vars
dotenv.config();

// Connect to Database
const connectDB = require("./config/db");
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files (PDFs, docs, images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import Routes
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/categories");
const courseRoutes = require("./routes/courses");
const enrollmentRoutes = require("./routes/enrollments");
const assignmentRoutes = require("./routes/assignments");
const submissionRoutes = require("./routes/submissions");
const adminRoutes = require("./routes/admin");
const uploadRoutes = require("./routes/upload");

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Online Classroom API is running 🚀",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      categories: "/api/categories",
      courses: "/api/courses",
      enrollments: "/api/enrollments",
      assignments: "/api/assignments",
      submissions: "/api/submissions",
      admin: "/api/admin",
      upload: "/api/upload",
    },
  });
});

// Error handling middlewares
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy trên cổng ${PORT} (http://localhost:${PORT})`);
});
