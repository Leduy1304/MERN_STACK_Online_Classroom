const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Tiêu đề tài liệu là bắt buộc"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["pdf", "video", "reading"],
      required: true,
      default: "reading",
    },
    fileUrl: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    duration: {
      type: String,
      default: "15 phút",
    },
    order: {
      type: Number,
      default: 1,
    },
  },
  { _id: true, timestamps: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Tiêu đề khóa học là bắt buộc"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Mô tả khóa học là bắt buộc"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Khóa học phải thuộc một danh mục"],
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Khóa học phải có giảng viên phụ trách"],
    },
    thumbnail: {
      type: String,
      default: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60",
    },
    level: {
      type: String,
      enum: ["Cơ bản", "Trung cấp", "Nâng cao"],
      default: "Cơ bản",
    },
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "published",
    },
    materials: [materialSchema],
  },
  {
    timestamps: true,
  }
);

// Virtual for enrollment count
courseSchema.virtual("enrollments", {
  ref: "Enrollment",
  localField: "_id",
  foreignField: "course",
});

module.exports = mongoose.model("Course", courseSchema);
