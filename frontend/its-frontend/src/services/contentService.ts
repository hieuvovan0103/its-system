import type { Content, ContentFormData } from "@/types";
import api from "./api";

export const contentService = {
  
  async getAll(): Promise<Content[]> {
    const response = await api.get<Content[]>("/contents");
    return response.data;
  },

  
  async getByCourse(courseId: number): Promise<Content[]> {
    const response = await api.get<Content[]>(`/contents/course/${courseId}`);
    return response.data;
  },

  
  async getById(id: number): Promise<Content> {
    const response = await api.get<Content>(`/contents/${id}`);
    return response.data;
  },

  
  async create(data: ContentFormData): Promise<Content> {
    const response = await api.post<Content>("/contents", data);
    return response.data;
  },

  
  async update(id: number, data: ContentFormData): Promise<Content> {
    const response = await api.put<Content>(`/contents/${id}`, data);
    return response.data;
  },

  
  async delete(id: number): Promise<void> {
    await api.delete(`/contents/${id}`);
  },
};