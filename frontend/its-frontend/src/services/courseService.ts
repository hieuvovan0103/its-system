import api from './api';
import type { Course, CourseFormData } from '@/types';

export const courseService = {
    
    getAll: async (): Promise<Course[]> => {
        const response = await api.get<Course[]>('/courses');
        return response.data;
    },

    
    getById: async (id: number): Promise<Course> => {
        const response = await api.get<Course>(`/courses/${id}`);
        return response.data;
    },

    
    create: async (data: CourseFormData): Promise<Course> => {
        const response = await api.post<Course>('/courses', data);
        return response.data;
    },

    
    update: async (id: number, data: CourseFormData): Promise<Course> => {
        const response = await api.put<Course>(`/courses/${id}`, data);
        return response.data;
    },

    
    delete: async (id: number): Promise<void> => {
        await api.delete(`/courses/${id}`);
    },
};