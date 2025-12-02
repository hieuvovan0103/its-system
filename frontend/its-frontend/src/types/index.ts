export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';

// --- AUTH TYPES ---
export interface User {
  email: string;
  role: UserRole;
  name?: string;
}

// ... (Các interfaces LoginRequest, LoginResponse, RegisterRequest giữ nguyên) ...

// --- COURSE TYPES ---
export interface Course {
  id: number;
  title: string;
  description: string;
}

export interface CourseFormData {
  title: string;
  description: string;
}

// --- CONTENT TYPES ---
export type ContentType = 'VIDEO' | 'DOCUMENT' | 'QUIZ';

export interface Content {
  id: number;
  title: string;
  type: ContentType;
  url: string;
  courseId: number;
  courseName?: string;
}

export interface ContentFormData {
  title: string;
  type: ContentType;
  url: string;
  courseId: number;
}

// --- ASSESSMENT TYPES ---

export type AssessmentType = 'QUIZ' | 'EXAM' | 'PROJECT';

export interface Assessment {
  id: number;
  title: string;
  description: string;
  type: AssessmentType;
  courseId: number;
  totalScore: number;
  dueDate?: string;
  timeLimit?: number;
  questions?: Question[]; // ✅ Đổi thành optional, có thể không load khi GET list
  createdAt?: string;
}

export interface AssessmentFormData {
  title: string;
  description: string;
  type: AssessmentType;
  courseId: number;
  dueDate?: string;
  timeLimit?: number;
}

// --- QUESTION TYPES (Đã đồng bộ hóa với QuestionDTO.java) ---

export interface Question {
  id: number;
  text: string;
  type: string;      // 'MCQ', 'ESSAY', 'CODING'
  score: number;
  options?: string[]; // Backend trả về List<String>
  correctOptionIndex?: number | null; // Sử dụng number hoặc null/undefined
  maxLengthAnswer?: number;
  rubric?: string;
}

export interface QuestionFormData {
  text: string; // ✅ Đổi từ 'content' sang 'text' để khớp với Entity/DTO
  type: string;
  score: number;
  // Các field hỗ trợ UI/Form
  options?: string[];
  correctOptionIndex?: number | null;
  // Bạn có thể xóa các field cũ như optionA, optionB... nếu form đã cập nhật
}


// --- SUBMISSION / GRADING TYPES ---

// ✅ CẬP NHẬT: Đây là DTO chứa câu trả lời gửi lên Backend (khớp với SubmissionDTO/AnswerDTO)
export interface AnswerDTO {
  questionId: number;
  selectedOptionIndex?: number | null; // Dùng cho trắc nghiệm (khớp với Java Integer)
  content?: string;             // Dùng cho câu hỏi tự luận (khớp với Java String)
}

// ✅ CẬP NHẬT: Submission là Entity/DTO trả về sau khi nộp bài
export interface Submission {
  id?: number;
  assessmentId?: number;
  studentId?: number;
  // Các field dưới đây nên được lấy từ Grade DTO hoặc tính toán trong Service
  totalQuestions?: number;
  correctAnswers?: number;
  score?: number;
  feedback?: string;
  submittedAt?: string;
  // Có thể thêm List<AnswerDTO> nếu bạn muốn hiển thị lại đáp án
}

// ✅ THÊM MỚI: DTO điểm số (trả về từ hàm submit) - Khớp với GradeDTO.java
export interface Grade {
  id: number;
  submissionId: number;
  totalScore: number;
  maxScore: number;
  percentage: number;
  letterGrade: string;
  gradedBy: string;
  feedback?: string;
  gradedAt: string;
}