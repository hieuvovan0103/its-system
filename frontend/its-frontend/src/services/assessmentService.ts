import type { Assessment, AssessmentFormData, Question, QuestionFormData, Submission, Answer, Grade } from '@/types';
import api from './api';

export const assessmentService = {
  // 1. Lấy danh sách đề thi
  // GET /api/v1/assessments
  async getAll(): Promise<Assessment[]> {
    const response = await api.get<Assessment[]>('/assessments');
    return response.data;
  },

  // 2. Lấy chi tiết đề thi
  // GET /api/v1/assessments/{id}
  async getById(id: number): Promise<Assessment> {
    const response = await api.get<Assessment>(`/assessments/${id}`);
    return response.data;
  },

  // 3. Tạo đề thi mới (Instructor)
  // POST /api/v1/assessments
  async create(data: AssessmentFormData): Promise<Assessment> {
    const response = await api.post<Assessment>('/assessments', data);
    return response.data;
  },

  // 4. Cập nhật đề thi
  // PUT /api/v1/assessments/{id}
  async update(id: number, data: AssessmentFormData): Promise<Assessment> {
    const response = await api.put<Assessment>(`/assessments/${id}`, data);
    return response.data;
  },

  // 5. Xóa đề thi
  // DELETE /api/v1/assessments/{id}
  async delete(id: number): Promise<void> {
    await api.delete(`/assessments/${id}`);
  },

  // 6. Thêm câu hỏi vào đề thi
  // POST /api/v1/assessments/{id}/questions
  async addQuestion(assessmentId: number, question: QuestionFormData): Promise<Question> {
    const response = await api.post<Question>(`/assessments/${assessmentId}/questions`, question);
    return response.data;
  },

  // 7. Cập nhật câu hỏi (Cần backend hỗ trợ API này)
  // PUT /api/v1/assessments/questions/{questionId}
  async updateQuestion(assessmentId: number, questionId: number, question: QuestionFormData): Promise<Question> {
    // Lưu ý: Bạn cần đảm bảo Backend có API update câu hỏi riêng hoặc update thông qua Quiz
    const response = await api.put<Question>(`/assessments/questions/${questionId}`, question);
    return response.data;
  },

  // 8. Xóa câu hỏi
  // DELETE /api/v1/assessments/questions/{questionId}
  async deleteQuestion(assessmentId: number, questionId: number): Promise<void> {
    // URL CHUẨN: /assessments/{assessmentId}/questions/{questionId}
    await api.delete(`/assessments/${assessmentId}/questions/${questionId}`);
  },

  // 9. Nộp bài thi (Student)
  // POST /api/v1/assessments/{id}/submit
  async submitAssessment(assessmentId: number, answers: Answer[]): Promise<Submission> {

    // ✅ CHUYỂN ĐỔI: Chuyển Answer[] sang cấu trúc AnswerDTO[] mà Backend cần
    const answersDTOs = answers.map(ans => ({
      questionId: ans.questionId,
      // Backend cần selectedOptionIndex (kiểu số) cho trắc nghiệm
      selectedOptionIndex: ans.selectedOptionIndex !== undefined ? ans.selectedOptionIndex : null,
      // Backend cần content (kiểu chuỗi) cho tự luận
      content: ans.content || null
    }));

    const payload = {
      // ✅ Gửi một MẢNG (Array) các AnswerDTO
      answers: answersDTOs
    }

    // Lưu ý: Cần chắc chắn bạn đã cập nhật interface Answer trong types.ts
    const response = await api.post<Submission>(`/assessments/${assessmentId}/submit`, payload);
    return response.data;
  },

  // 10. Xem lịch sử/kết quả (Optional - Cần backend hỗ trợ)
  async getSubmissions(assessmentId: number): Promise<Submission[]> {
    const response = await api.get<Submission[]>(`/assessments/${assessmentId}/submissions`);
    return response.data;
  },

  async getAssessmentHistory(): Promise<Submission[]> {
    const response = await api.get<Submission[]>('/assessments/history');
    return response.data;
  }
};