export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';


export interface User {
  email: string;
  role: UserRole;
  name?: string;
}


export interface Course {
  id: number;
  title: string;
  description: string;
}

export interface CourseFormData {
  title: string;
  description: string;
}


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
  questions?: Question[]; 
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

 

export interface Question {
  id: number;
  text: string;
  type: string;      
  score: number;
  options?: string[]; 
  correctOptionIndex?: number | null; 
  maxLengthAnswer?: number;
  rubric?: string;
}

export interface QuestionFormData {
  text: string; 
  type: string;
  score: number;
  options?: string[];
  correctOptionIndex?: number | null;
}




export interface AnswerDTO {
  questionId: number;
  selectedOptionIndex?: number | null; 
  content?: string;             
}


export interface Submission {
  id?: number;
  assessmentId?: number;
  studentId?: number;
  
  totalQuestions?: number;
  correctAnswers?: number;
  score?: number;
  feedback?: string;
  submittedAt?: string;
  
}


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