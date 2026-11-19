import axios from "axios";

const API_BASE = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Format response & error message
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Đã có lỗi xảy ra. Vui lòng thử lại.";
    return Promise.reject(new Error(message));
  }
);

// 1. Auth API
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
  changePassword: (data) => api.put("/auth/change-password", data),
};

// 2. Category API
export const categoryAPI = {
  getAll: () => api.get("/categories"),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post("/categories", data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// 3. Course API
export const courseAPI = {
  getAll: (params) => api.get("/courses", { params }),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post("/courses", data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  addMaterial: (courseId, data) => api.post(`/courses/${courseId}/materials`, data),
  updateMaterial: (courseId, materialId, data) =>
    api.put(`/courses/${courseId}/materials/${materialId}`, data),
  deleteMaterial: (courseId, materialId) =>
    api.delete(`/courses/${courseId}/materials/${materialId}`),
  getMyTeachingCourses: () => api.get("/courses/teacher/my-courses"),
};

// 4. Enrollment API
export const enrollmentAPI = {
  enroll: (courseId) => api.post(`/enrollments/${courseId}`),
  getMyEnrolled: () => api.get("/enrollments/my-courses"),
  checkEnrollment: (courseId) => api.get(`/enrollments/check/${courseId}`),
  updateProgress: (courseId, materialId) =>
    api.put(`/enrollments/${courseId}/progress`, { materialId }),
  getCourseStudents: (courseId) =>
    api.get(`/enrollments/course/${courseId}/students`),
};

// 5. Assignment API
export const assignmentAPI = {
  create: (data) => api.post("/assignments", data),
  getByCourse: (courseId) => api.get(`/assignments/course/${courseId}`),
  getById: (id) => api.get(`/assignments/${id}`),
  update: (id, data) => api.put(`/assignments/${id}`, data),
  delete: (id) => api.delete(`/assignments/${id}`),
};

// 6. Submission API
export const submissionAPI = {
  submit: (assignmentId, data) => api.post(`/submissions/${assignmentId}`, data),
  getByAssignment: (assignmentId) =>
    api.get(`/submissions/assignment/${assignmentId}`),
  getMySubmission: (assignmentId) => api.get(`/submissions/my/${assignmentId}`),
  grade: (id, data) => api.put(`/submissions/${id}/grade`, data),
};

// 7. Admin API
export const adminAPI = {
  getStats: () => api.get("/admin/stats"),
  getAllUsers: (params) => api.get("/admin/users", { params }),
  toggleStatus: (id) => api.put(`/admin/users/${id}/toggle-status`),
  updateRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

// 8. Upload API
export const uploadAPI = {
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default api;
