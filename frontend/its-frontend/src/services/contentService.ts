import type { Content, ContentFormData } from '@/types';
import api from './api';

// Mock data for demo (matches backend structure)
let mockContents: Content[] = [
  {
    id: 1,
    title: 'Introduction to Programming',
    topic: 'Python Basics',
    type: 'VIDEO',
    url: 'https://example.com/video1',
  },
  {
    id: 2,
    title: 'Data Structures Guide',
    topic: 'Data Structures',
    type: 'DOCUMENT',
    url: 'https://example.com/doc1',
  },
  {
    id: 3,
    title: 'Algorithm Practice Quiz',
    topic: 'Algorithms',
    type: 'QUIZ',
    url: 'https://example.com/quiz1',
  },
];

export const contentService = {
  async getAll(): Promise<Content[]> {
    try {
      const response = await api.get<Content[]>('/v1/contents');
      return response.data;
    } catch {
      // Return mock data if API is not available
      return mockContents;
    }
  },

  async getById(id: number): Promise<Content> {
    try {
      const response = await api.get<Content>(`/v1/contents/${id}`);
      return response.data;
    } catch {
      const content = mockContents.find(c => c.id === id);
      if (!content) throw new Error('Content not found');
      return content;
    }
  },

  async create(data: ContentFormData): Promise<Content> {
    try {
      const response = await api.post<Content>('/v1/contents', data);
      return response.data;
    } catch {
      // Mock create
      const newContent: Content = {
        id: mockContents.length + 1,
        ...data,
      };
      mockContents.push(newContent);
      return newContent;
    }
  },

  async update(id: number, data: ContentFormData): Promise<Content> {
    try {
      const response = await api.put<Content>(`/v1/contents/${id}`, data);
      return response.data;
    } catch {
      // Mock update
      const index = mockContents.findIndex(c => c.id === id);
      if (index === -1) throw new Error('Content not found');
      mockContents[index] = { ...mockContents[index], ...data };
      return mockContents[index];
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/v1/contents/${id}`);
    } catch {
      // Mock delete
      mockContents = mockContents.filter(c => c.id !== id);
    }
  },

  // NOTE: getByCourse is not implemented in backend
  // This function only works with mock data
  // async getByCourse(courseId: number): Promise<Content[]> { ... }
};
