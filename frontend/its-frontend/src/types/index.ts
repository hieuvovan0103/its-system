// User types
export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

// Content types (matches backend: VIDEO, DOCUMENT, QUIZ)
export type ContentType = 'VIDEO' | 'DOCUMENT' | 'QUIZ';

export interface Content {
  id: number;
  title: string;
  topic: string;  // matches backend field name
  type: ContentType;
  url: string;
  courseId?: number;    // not in backend yet
  createdAt?: string;   // not in backend yet
  updatedAt?: string;   // not in backend yet
}

export interface ContentFormData {
  title: string;
  topic: string;  // matches backend field name
  type: ContentType;
  url: string;
  courseId?: number;  // not in backend yet
}

// Course types
export interface Course {
  id: number;
  title: string;
  description: string;
  instructorId: number;
  createdAt?: string;
}

// Assessment types
export type AssessmentType = 'QUIZ' | 'EXAM' | 'PROJECT';
export type QuestionType = 'MCQ' | 'ESSAY' | 'CODING';
export type SubmissionStatus = 'DRAFT' | 'SUBMITTED' | 'GRADED';

export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  score: number;
  options?: string[];
  correctOptionIndex?: number;
  maxLengthAnswer?: number;  // for Essay questions
  rubric?: string;           // for Essay questions - grading rubric
}

export interface Assessment {
  id: number;
  title: string;
  description: string;
  type: AssessmentType;
  courseId: number;
  questions: Question[];
  totalScore: number;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AssessmentFormData {
  title: string;
  description: string;
  type: AssessmentType;
  courseId: number;
  dueDate?: string;
}

export interface QuestionFormData {
  text: string;
  type: QuestionType;
  score: number;
  options?: string[];
  correctOptionIndex?: number;
  maxLengthAnswer?: number;  // for Essay questions
  rubric?: string;           // for Essay questions
}

export interface Answer {
  id?: number;
  questionId: number;
  content: string;
  selectedOptionIndex?: number;
  score?: number;
}

export interface Submission {
  id: number;
  assessmentId: number;
  studentId: number;
  answers: Answer[];
  status: SubmissionStatus;
  totalScore?: number;
  submittedAt?: string;
  gradedAt?: string;
}

// Feedback types
export type FeedbackType = 'POSITIVE' | 'CORRECTIVE' | 'EXPLANATORY';

export interface Feedback {
  id: number;
  submissionId: number;
  message: string;
  type: FeedbackType;
  createdAt?: string;
}

export interface Grade {
  id: number;
  submissionId?: number;
  totalScore: number;
  maxScore?: number;
  gradedAt: string;
  gradedBy: string;
  feedback?: string;
  percentage?: number;
  letterGrade?: string;
}

// Progress types
export interface Progress {
  id: number;
  studentId: number;
  courseId: number;
  completionRate: number;
  lastUpdate: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}
