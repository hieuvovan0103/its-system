import type { Assessment, AssessmentFormData, Question, QuestionFormData, Submission, Answer, Grade } from '@/types';
import api from './api';

// Mock data for demo
let mockAssessments: Assessment[] = [
  {
    id: 1,
    title: 'Python Basics Quiz',
    description: 'Test your knowledge of Python fundamentals',
    type: 'QUIZ',
    courseId: 1,
    totalScore: 100,
    dueDate: '2024-02-15T23:59:59Z',
    createdAt: '2024-01-20T10:00:00Z',
    questions: [
      {
        id: 1,
        text: 'What is the output of print(2 ** 3)?',
        type: 'MCQ',
        score: 10,
        options: ['6', '8', '9', '5'],
        correctOptionIndex: 1,
      },
      {
        id: 2,
        text: 'Which keyword is used to define a function in Python?',
        type: 'MCQ',
        score: 10,
        options: ['function', 'def', 'func', 'define'],
        correctOptionIndex: 1,
      },
    ],
  },
  {
    id: 2,
    title: 'Data Structures Exam',
    description: 'Comprehensive exam on data structures',
    type: 'EXAM',
    courseId: 1,
    totalScore: 150,
    dueDate: '2024-02-20T23:59:59Z',
    createdAt: '2024-01-22T10:00:00Z',
    questions: [
      {
        id: 3,
        text: 'Explain the difference between a stack and a queue.',
        type: 'ESSAY',
        score: 50,
      },
    ],
  },
  {
    id: 3,
    title: 'Algorithm Project',
    description: 'Implement a sorting algorithm',
    type: 'PROJECT',
    courseId: 2,
    totalScore: 200,
    dueDate: '2024-03-01T23:59:59Z',
    createdAt: '2024-01-25T10:00:00Z',
    questions: [
      {
        id: 4,
        text: 'Implement quicksort algorithm in your preferred language.',
        type: 'CODING',
        score: 200,
      },
    ],
  },
];

let mockSubmissions: Submission[] = [
  {
    id: 1,
    assessmentId: 1,
    studentId: 3,
    answers: [
      { questionId: 1, content: '', selectedOptionIndex: 1 },
      { questionId: 2, content: '', selectedOptionIndex: 1 },
    ],
    status: 'GRADED',
    totalScore: 20,
    submittedAt: '2024-02-10T15:30:00Z',
    gradedAt: '2024-02-11T10:00:00Z',
  },
];

let nextQuestionId = 5;

export const assessmentService = {
  async getAll(): Promise<Assessment[]> {
    try {
      const response = await api.get<Assessment[]>('/v1/assessments');
      return response.data;
    } catch {
      return mockAssessments;
    }
  },

  async getById(id: number): Promise<Assessment> {
    try {
      const response = await api.get<Assessment>(`/v1/assessments/${id}`);
      return response.data;
    } catch {
      const assessment = mockAssessments.find(a => a.id === id);
      if (!assessment) throw new Error('Assessment not found');
      return assessment;
    }
  },

  async create(data: AssessmentFormData): Promise<Assessment> {
    try {
      const response = await api.post<Assessment>('/v1/assessments', data);
      return response.data;
    } catch {
      const newAssessment: Assessment = {
        id: mockAssessments.length + 1,
        ...data,
        questions: [],
        totalScore: 0,
        createdAt: new Date().toISOString(),
      };
      mockAssessments.push(newAssessment);
      return newAssessment;
    }
  },

  async update(id: number, data: AssessmentFormData): Promise<Assessment> {
    try {
      const response = await api.put<Assessment>(`/v1/assessments/${id}`, data);
      return response.data;
    } catch {
      const index = mockAssessments.findIndex(a => a.id === id);
      if (index === -1) throw new Error('Assessment not found');
      mockAssessments[index] = { ...mockAssessments[index], ...data };
      return mockAssessments[index];
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/v1/assessments/${id}`);
    } catch {
      mockAssessments = mockAssessments.filter(a => a.id !== id);
    }
  },

  async addQuestion(assessmentId: number, question: QuestionFormData): Promise<Question> {
    try {
      const response = await api.post<Question>(`/v1/assessments/${assessmentId}/questions`, question);
      return response.data;
    } catch {
      const assessment = mockAssessments.find(a => a.id === assessmentId);
      if (!assessment) throw new Error('Assessment not found');

      const newQuestion: Question = {
        id: nextQuestionId++,
        ...question,
      };
      assessment.questions.push(newQuestion);
      assessment.totalScore += question.score;
      return newQuestion;
    }
  },

  async updateQuestion(assessmentId: number, questionId: number, question: QuestionFormData): Promise<Question> {
    try {
      const response = await api.put<Question>(`/v1/assessments/${assessmentId}/questions/${questionId}`, question);
      return response.data;
    } catch {
      const assessment = mockAssessments.find(a => a.id === assessmentId);
      if (!assessment) throw new Error('Assessment not found');

      const qIndex = assessment.questions.findIndex(q => q.id === questionId);
      if (qIndex === -1) throw new Error('Question not found');

      const oldScore = assessment.questions[qIndex].score;
      assessment.questions[qIndex] = { ...assessment.questions[qIndex], ...question };
      assessment.totalScore = assessment.totalScore - oldScore + question.score;

      return assessment.questions[qIndex];
    }
  },

  async deleteQuestion(assessmentId: number, questionId: number): Promise<void> {
    try {
      await api.delete(`/v1/assessments/${assessmentId}/questions/${questionId}`);
    } catch {
      const assessment = mockAssessments.find(a => a.id === assessmentId);
      if (!assessment) throw new Error('Assessment not found');

      const question = assessment.questions.find(q => q.id === questionId);
      if (question) {
        assessment.totalScore -= question.score;
        assessment.questions = assessment.questions.filter(q => q.id !== questionId);
      }
    }
  },

  async submitAssessment(assessmentId: number, answers: Answer[], studentId: number = 3): Promise<Submission> {
    try {
      // Backend expects full Submission object with studentId and answers
      const submission = {
        assessmentId,
        studentId,
        answers,
      };
      const response = await api.post<Submission>(`/v1/assessments/${assessmentId}/submit`, submission);
      return response.data;
    } catch {
      const newSubmission: Submission = {
        id: mockSubmissions.length + 1,
        assessmentId,
        studentId,
        answers,
        status: 'SUBMITTED',
        submittedAt: new Date().toISOString(),
      };
      mockSubmissions.push(newSubmission);
      return newSubmission;
    }
  },

  async getSubmissions(assessmentId: number): Promise<Submission[]> {
    try {
      const response = await api.get<Submission[]>(`/v1/assessments/${assessmentId}/submissions`);
      return response.data;
    } catch {
      return mockSubmissions.filter(s => s.assessmentId === assessmentId);
    }
  },

  async gradeSubmission(submissionId: number, gradedBy: string = 'Instructor', feedback?: string): Promise<Grade> {
    try {
      // Backend endpoint: POST /api/v1/assessments/submissions/{id}/grade
      const response = await api.post<Grade>(`/v1/assessments/submissions/${submissionId}/grade`, {
        gradedBy,
        feedback,
      });
      return response.data;
    } catch {
      const submission = mockSubmissions.find(s => s.id === submissionId);
      if (!submission) throw new Error('Submission not found');

      // Calculate total score from answers (mock)
      const totalScore = submission.answers.reduce((sum, a) => sum + (a.score || 0), 0);
      submission.status = 'GRADED';
      submission.totalScore = totalScore;
      submission.gradedAt = new Date().toISOString();

      // Return mock grade
      return {
        id: submissionId,
        submissionId,
        totalScore,
        maxScore: 100,
        gradedAt: submission.gradedAt,
        gradedBy,
        feedback,
      };
    }
  },

  async getSubmissionById(submissionId: number): Promise<Submission> {
    try {
      const response = await api.get<Submission>(`/v1/assessments/submissions/${submissionId}`);
      return response.data;
    } catch {
      const submission = mockSubmissions.find(s => s.id === submissionId);
      if (!submission) throw new Error('Submission not found');
      return submission;
    }
  },

  async getGrade(submissionId: number): Promise<Grade> {
    try {
      const response = await api.get<Grade>(`/v1/assessments/submissions/${submissionId}/grade`);
      return response.data;
    } catch {
      // Return mock grade
      const submission = mockSubmissions.find(s => s.id === submissionId);
      if (!submission) throw new Error('Submission not found');
      return {
        id: submissionId,
        submissionId,
        totalScore: submission.totalScore || 0,
        maxScore: 100,
        gradedAt: submission.gradedAt || new Date().toISOString(),
        gradedBy: 'Instructor',
      };
    }
  },

  async gradeAnswer(answerId: number, score: number): Promise<Answer> {
    try {
      const response = await api.put<Answer>(`/v1/assessments/answers/${answerId}/score`, null, {
        params: { score },
      });
      return response.data;
    } catch {
      // Mock: find and update the answer
      for (const submission of mockSubmissions) {
        const answer = submission.answers.find(a => a.id === answerId);
        if (answer) {
          answer.score = score;
          return answer;
        }
      }
      throw new Error('Answer not found');
    }
  },

  async getAssessmentHistory(studentId: number): Promise<Submission[]> {
    try {
      const response = await api.get<Submission[]>(`/v1/assessments/history/${studentId}`);
      return response.data;
    } catch {
      return mockSubmissions.filter(s => s.studentId === studentId);
    }
  },
};
