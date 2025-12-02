import type { Content, ContentFormData } from "@/types";
import api from "./api";

export const contentService = {
  // Lấy tất cả content (nếu cần)
  async getAll(): Promise<Content[]> {
    const response = await api.get<Content[]>("/contents");
    return response.data;
  },

  // Lấy danh sách bài học theo Khóa học (Course)
  // Backend API: GET /api/v1/contents/course/{courseId}
  async getByCourse(courseId: number): Promise<Content[]> {
    const response = await api.get<Content[]>(`/contents/course/${courseId}`);
    return response.data;
  },

  // Lấy chi tiết 1 bài học
  async getById(id: number): Promise<Content> {
    const response = await api.get<Content>(`/contents/${id}`);
    return response.data;
  },

  // Tạo mới bài học
  // Backend API: POST /api/v1/contents
  async create(data: ContentFormData): Promise<Content> {
    const response = await api.post<Content>("/contents", data);
    return response.data;
  },

  // Cập nhật bài học
  // Backend API: PUT /api/v1/contents/{id}
  async update(id: number, data: ContentFormData): Promise<Content> {
    const response = await api.put<Content>(`/contents/${id}`, data);
    return response.data;
  },

  // Xóa bài học
  // Backend API: DELETE /api/v1/contents/{id}
  async delete(id: number): Promise<void> {
    await api.delete(`/contents/${id}`);
  },
};