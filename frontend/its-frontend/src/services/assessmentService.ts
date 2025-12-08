import type { Assessment, AssessmentFormData, Question, QuestionFormData, Submission, Answer, Grade } from '@/types';
import api from './api';

export const assessmentService = {

  async getAll(): Promise<Assessment[]> {
    const response = await api.get<Assessment[]>('/assessments');
    return response.data;
  },

 
  async getById(id: number): Promise<Assessment> {
    const response = await api.get<Assessment>(`/assessments/${id}`);
    return response.data;
  },

  
  async create(data: AssessmentFormData): Promise<Assessment> {
    const response = await api.post<Assessment>('/assessments', data);
    return response.data;
  },

  
  async update(id: number, data: AssessmentFormData): Promise<Assessment> {
    const response = await api.put<Assessment>(`/assessments/${id}`, data);
    return response.data;
  },

  
  async delete(id: number): Promise<void> {
    await api.delete(`/assessments/${id}`);
  },

  
  async addQuestion(assessmentId: number, question: QuestionFormData): Promise<Question> {
    const response = await api.post<Question>(`/assessments/${assessmentId}/questions`, question);
    return response.data;
  },

  
  async updateQuestion(assessmentId: number, questionId: number, question: QuestionFormData): Promise<Question> {
    const response = await api.put<Question>(`/assessments/questions/${questionId}`, question);
    return response.data;
  },

  
  async deleteQuestion(assessmentId: number, questionId: number): Promise<void> {
    await api.delete(`/assessments/${assessmentId}/questions/${questionId}`);
  },

  async submitAssessment(assessmentId: number, answers: Answer[]): Promise<Submission> {

    const answersDTOs = answers.map(ans => ({
      questionId: ans.questionId,
      selectedOptionIndex: ans.selectedOptionIndex !== undefined ? ans.selectedOptionIndex : null,
      content: ans.content || null
    }));

    const payload = {
      answers: answersDTOs
    }

    const response = await api.post<Submission>(`/assessments/${assessmentId}/submit`, payload);
    return response.data;
  },

  async getSubmissions(assessmentId: number): Promise<Submission[]> {
    const response = await api.get<Submission[]>(`/assessments/${assessmentId}/submissions`);
    return response.data;
  },

  async getAssessmentHistory(): Promise<Submission[]> {
    const response = await api.get<Submission[]>('/assessments/history');
    return response.data;
  }
};