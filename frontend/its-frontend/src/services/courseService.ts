import api from './api';
import type { Course, CourseFormData } from '@/types';

export const courseService = {
    // Lấy danh sách tất cả khóa học
    // GET /api/v1/courses
    getAll: async (): Promise<Course[]> => {
        const response = await api.get<Course[]>('/courses');
        return response.data;
    },

    // Lấy chi tiết một khóa học
    // GET /api/v1/courses/{id}
    getById: async (id: number): Promise<Course> => {
        const response = await api.get<Course>(`/courses/${id}`);
        return response.data;
    },

    // Tạo khóa học mới (Chỉ Instructor)
    // POST /api/v1/courses
    create: async (data: CourseFormData): Promise<Course> => {
        const response = await api.post<Course>('/courses', data);
        return response.data;
    },

    // Cập nhật khóa học
    // PUT /api/v1/courses/{id}
    update: async (id: number, data: CourseFormData): Promise<Course> => {
        const response = await api.put<Course>(`/courses/${id}`, data);
        return response.data;
    },

    // Xóa khóa học
    // DELETE /api/v1/courses/{id}
    delete: async (id: number): Promise<void> => {
        await api.delete(`/courses/${id}`);
    },
};