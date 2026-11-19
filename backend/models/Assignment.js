const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Bài tập phải thuộc về một khóa học"],
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Bài tập phải gắn với giảng viên tạo"],
    },
    title: {
      type: String,
      required: [true, "Tiêu đề bài tập là bắt buộc"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Nội dung yêu cầu bài tập là bắt buộc"],
    },
    deadline: {
      type: Date,
      required: [true, "Hạn nộp bài là bắt buộc"],
    },
    maxScore: {
      type: Number,
      default: 10,
      min: 1,
    },
    attachmentUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
