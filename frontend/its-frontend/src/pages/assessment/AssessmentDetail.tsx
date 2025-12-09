import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { assessmentService } from '@/services/assessmentService';
// Cập nhật import type để khớp với file types/index.ts mới
import type { Assessment, Question, QuestionFormData } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Play,
  Clock,
  Award,
  HelpCircle,
  FileText,
  Code,
  CheckCircle2,
  Calendar,
  Loader2
} from 'lucide-react';


const questionTypeConfig: Record<string, { icon: any; color: string; bgColor: string; label: string }> = {
  MCQ: { icon: CheckCircle2, color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Multiple Choice' },
  ESSAY: { icon: FileText, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Essay' },
  CODING: { icon: Code, color: 'text-purple-600', bgColor: 'bg-purple-100', label: 'Coding' },
};

export default function AssessmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);


  const [mcqOptions, setMcqOptions] = useState<string[]>(['', '', '', '']);

  const isInstructor = user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN';

  const {
    register,
    handleSubmit,
    reset,
    watch,

    formState: { errors, isSubmitting },
  } = useForm<QuestionFormData>();

 
  const watchedType = watch('type');

  useEffect(() => {
    if (id) loadAssessment();
  }, [id]);

  const loadAssessment = async () => {
    try {
      setIsLoading(true);
      const data = await assessmentService.getById(Number(id));
      setAssessment(data);
    } catch (error) {
      console.error('Failed to load assessment:', error);
    } finally {
      setIsLoading(false);
    }
  };

 

  const openCreateQuestionModal = () => {
    setEditingQuestion(null);
    setMcqOptions(['', '', '', '']); 
    reset({
      content: '',
      type: 'MCQ',
      score: 10,
      correctAnswer: '0', 
    });
    setIsQuestionModalOpen(true);
  };

  const openEditQuestionModal = (question: Question) => {
    setEditingQuestion(question);

  
    if (question.type === 'MCQ' && question.options) {
      const opts = [...question.options];
     
      while (opts.length < 4) opts.push('');
      setMcqOptions(opts);
    } else {
      setMcqOptions(['', '', '', '']);
    }

    reset({
      content: question.content || question.text, 
      type: question.type as any,
      score: question.score,
      
      correctAnswer: String(question.correctOptionIndex ?? 0),
    });
    setIsQuestionModalOpen(true);
  };

 
  const handleDeleteQuestion = async (questionId: number) => {
    if (!assessment || !confirm('Are you sure you want to delete this question?')) return;

    try {
      await assessmentService.deleteQuestion(assessment.id, questionId);
      loadAssessment();
    } catch (error) {
      console.error('Failed to delete question:', error);
      alert('Failed to delete question');
    }
  };

  const onSubmitQuestion = async (data: QuestionFormData) => {
    if (!assessment) return;

    try {
      
      const payload = {
        text: data.content, 
        type: data.type,
        score: Number(data.score),
        options: data.type === 'MCQ' ? mcqOptions.filter(o => o.trim() !== '') : [],
        correctOptionIndex: data.type === 'MCQ' ? Number(data.correctAnswer) : undefined,
        rubric: data.type !== 'MCQ' ? data.correctAnswer : undefined 
      };

      if (editingQuestion) {
        await assessmentService.updateQuestion(assessment.id, editingQuestion.id, payload as any);
      } else {
        await assessmentService.addQuestion(assessment.id, payload as any);
      }

      setIsQuestionModalOpen(false);
      loadAssessment();
    } catch (error) {
      console.error('Failed to save question:', error);
      alert('Failed to save question');
    }
  };

  const getOptionLabel = (index: number) => String.fromCharCode(65 + index);


  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
    );
  }

  if (!assessment) {
    return (
        <div className="text-center py-12">
          <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Assessment not found</h3>
          <Button onClick={() => navigate('/assessments')}>Back to Assessments</Button>
        </div>
    );
  }

  return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <button
                  onClick={() => navigate('/assessments')}
                  className="mt-1 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{assessment.title}</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                  {assessment.type}
                </span>
                </div>
                <p className="text-gray-600">{assessment.description}</p>

                <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span className="font-medium text-gray-900">{assessment.totalScore}</span> Total Points
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>{assessment.timeLimit ? `${assessment.timeLimit} mins` : 'No time limit'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-green-500" />
                    <span>Due: {assessment.dueDate ? new Date(assessment.dueDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {!isInstructor && (
                  <Button
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg"
                      onClick={() => navigate(`/assessments/${assessment.id}/take`)}
                  >
                    <Play className="w-4 h-4 mr-2" /> Take Assessment
                  </Button>
              )}
            </div>
          </div>
        </div>

         Questions List Section
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900">
              Questions ({assessment.questions?.length || 0})
            </h2>
            {isInstructor && (
                <Button size="sm" onClick={openCreateQuestionModal}>
                  <Plus className="w-4 h-4 mr-2" /> Add Question
                </Button>
            )}
          </div>

          <div className="divide-y divide-gray-100">
            {assessment.questions?.length === 0 ? (
                <div className="text-center py-12">
                  <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No questions added yet</h3>
                  {isInstructor && (
                      <Button variant="outline" onClick={openCreateQuestionModal}>
                        Add your first question
                      </Button>
                  )}
                </div>
            ) : (
                assessment.questions?.map((question, index) => {
                  const config = questionTypeConfig[question.type || 'MCQ']; // Fallback to MCQ
                  const Icon = config?.icon || HelpCircle;

                  return (
                      <div key={question.id} className="p-6 hover:bg-gray-50 transition-colors group relative">
                        {/* Question Header */}
                        <div className="flex items-start gap-4 mb-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold text-gray-600">
                      {index + 1}
                    </span>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 ${config?.bgColor} ${config?.color}`}>
                          <Icon className="w-3 h-3" /> {config?.label}
                        </span>
                              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {question.score} pts
                        </span>
                            </div>
                            <h3 className="text-gray-900 font-medium text-lg">{question.text || question.content}</h3>
                          </div>

                          {/* Instructor Actions */}
                          {isInstructor && (
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute top-6 right-6">
                                <button
                                    onClick={() => openEditQuestionModal(question)}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDeleteQuestion(question.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                          )}
                        </div>

                        {/* Question Content/Options */}
                        <div className="pl-12">
                          {question.type === 'MCQ' && question.options && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {question.options.map((opt, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-3 rounded-lg border text-sm flex items-center gap-3 ${
                                            // Highlight đáp án đúng cho giáo viên
                                            isInstructor && idx === question.correctOptionIndex
                                                ? 'bg-green-50 border-green-200 text-green-800 font-medium'
                                                : 'bg-white border-gray-200 text-gray-700'
                                        }`}
                                    >
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${
                                isInstructor && idx === question.correctOptionIndex
                                    ? 'border-green-500 bg-green-500 text-white'
                                    : 'border-gray-300 text-gray-500'
                            }`}>
                              {getOptionLabel(idx)}
                            </span>
                                      {opt}
                                      {isInstructor && idx === question.correctOptionIndex && (
                                          <CheckCircle2 className="w-4 h-4 text-green-600 ml-auto" />
                                      )}
                                    </div>
                                ))}
                              </div>
                          )}

                          {(question.type === 'ESSAY' || question.type === 'CODING') && (
                              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 border-dashed text-sm text-gray-500 italic">
                                {question.type === 'CODING' ? 'Students will write code here.' : 'Students will write an essay here.'}
                              </div>
                          )}
                        </div>
                      </div>
                  );
                })
            )}
          </div>
        </div>

        {/* Create/Edit Question Modal */}
        <Modal
            isOpen={isQuestionModalOpen}
            onClose={() => setIsQuestionModalOpen(false)}
            title={editingQuestion ? 'Edit Question' : 'Add Question'}
            size="lg"
        >
          <form onSubmit={handleSubmit(onSubmitQuestion)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                    {...register('type', { required: 'Type is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="MCQ">Multiple Choice</option>
                  <option value="ESSAY">Essay</option>
                  <option value="CODING">Coding</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                <input
                    type="number"
                    {...register('score', {
                      required: 'Score is required',
                      min: { value: 1, message: 'Min score is 1' }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="10"
                />
                {errors.score && (
                    <p className="mt-1 text-sm text-red-600">{errors.score.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Question Content</label>
              <textarea
                  {...register('content', { required: 'Question content is required' })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Enter your question..."
              />
              {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>

            {watchedType === 'MCQ' && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
                  <label className="block text-sm font-bold text-gray-700">Answer Options</label>
                  <div className="space-y-3">
                    {mcqOptions.map((option, index) => {
                      const label = getOptionLabel(index);
                      return (
                          <div key={index} className="flex items-center gap-3">
                            <div className="flex items-center h-5">
                              <input
                                  {...register('correctAnswer', { required: true })}
                                  type="radio"
                                  value={index}
                                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                              />
                            </div>
                            <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-xs text-gray-500">
                          {label}
                        </span>
                              <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => {
                                    const newOptions = [...mcqOptions];
                                    newOptions[index] = e.target.value;
                                    setMcqOptions(newOptions);
                                  }}
                                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                  placeholder={`Option ${label}`}
                                  required
                              />
                            </div>
                          </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500 text-right">* Select the correct answer</p>
                </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={() => setIsQuestionModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                {editingQuestion ? 'Save Changes' : 'Add Question'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
  );
}