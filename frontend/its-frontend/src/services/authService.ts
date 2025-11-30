import type { User, LoginRequest, RegisterRequest } from '@/types';
import api from './api';

// Mock auth for demo (replace with real API calls)
const MOCK_USERS: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@its.edu', role: 'ADMIN' },
  { id: 2, name: 'John Instructor', email: 'instructor@its.edu', role: 'INSTRUCTOR' },
  { id: 3, name: 'Jane Student', email: 'student@its.edu', role: 'STUDENT' },
];

export const authService = {
  async login(credentials: LoginRequest): Promise<{ user: User; token: string }> {
    // Mock implementation - replace with real API
    const user = MOCK_USERS.find(u => u.email === credentials.email);
    if (user && credentials.password === 'password123') {
      const token = btoa(JSON.stringify({ userId: user.id, exp: Date.now() + 86400000 }));
      return { user, token };
    }
    throw new Error('Invalid credentials');
  },

  async register(data: RegisterRequest): Promise<{ user: User; token: string }> {
    // Mock implementation - replace with real API
    const newUser: User = {
      id: MOCK_USERS.length + 1,
      name: data.name,
      email: data.email,
      role: data.role,
    };
    const token = btoa(JSON.stringify({ userId: newUser.id, exp: Date.now() + 86400000 }));
    return { user: newUser, token };
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get<User>('/auth/me');
      return response.data;
    } catch {
      return null;
    }
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
