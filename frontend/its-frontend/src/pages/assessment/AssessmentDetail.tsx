import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentService } from '@/services/assessmentService';
import type { Assessment, Question, QuestionFormData, QuestionType } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { useForm } from 'react-hook-form';
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
} from 'lucide-react';

const questionTypeConfig: Record<QuestionType, { icon: typeof HelpCircle; color: string; bgColor: string; label: string }> = {
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

  const questionType = watch('type');

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
    reset({
      text: '',
      type: 'MCQ',
      score: 10,
      options: [],
      correctOptionIndex: 0,
    });
    setMcqOptions(['', '', '', '']);
    setIsQuestionModalOpen(true);
  };

  const openEditQuestionModal = (question: Question) => {
    setEditingQuestion(question);
    reset({
      text: question.text,
      type: question.type,
      score: question.score,
      options: question.options,
      correctOptionIndex: question.correctOptionIndex,
    });
    setMcqOptions(question.options || ['', '', '', '']);
    setIsQuestionModalOpen(true);
  };

  const handleDeleteQuestion = async (questionId: number) => {
    if (!assessment || !confirm('Are you sure you want to delete this question?')) return;

    try {
      await assessmentService.deleteQuestion(assessment.id, questionId);
      setAssessment({
        ...assessment,
        questions: assessment.questions.filter((q) => q.id !== questionId),
        totalScore: assessment.totalScore - (assessment.questions.find(q => q.id === questionId)?.score || 0),
      });
    } catch (error) {
      console.error('Failed to delete question:', error);
    }
  };

  const onSubmitQuestion = async (data: QuestionFormData) => {
    if (!assessment) return;

    try {
      const questionData: QuestionFormData = {
        ...data,
        options: data.type === 'MCQ' ? mcqOptions.filter(o => o.trim()) : undefined,
      };

      if (editingQuestion) {
        const updated = await assessmentService.updateQuestion(assessment.id, editingQuestion.id, questionData);
        setAssessment({
          ...assessment,
          questions: assessment.questions.map((q) => (q.id === editingQuestion.id ? updated : q)),
          totalScore: assessment.totalScore - editingQuestion.score + data.score,
        });
      } else {
        const created = await assessmentService.addQuestion(assessment.id, questionData);
        setAssessment({
          ...assessment,
          questions: [...assessment.questions, created],
          totalScore: assessment.totalScore + data.score,
        });
      }
      setIsQuestionModalOpen(false);
    } catch (error) {
      console.error('Failed to save question:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <Card>
          <CardContent className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!assessment) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Assessment not found</h3>
          <Button onClick={() => navigate('/assessments')}>Back to Assessments</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/assessments')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{assessment.title}</h1>
            <Badge
              variant={
                assessment.type === 'QUIZ' ? 'info' :
                assessment.type === 'EXAM' ? 'error' : 'primary'
              }
            >
              {assessment.type}
            </Badge>
          </div>
          <p className="text-gray-600 mt-1">{assessment.description}</p>
        </div>
        {!isInstructor && (
          <Button
            leftIcon={<Play className="w-4 h-4" />}
            onClick={() => navigate(`/assessments/${assessment.id}/take`)}
          >
            Take Assessment
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{assessment.totalScore}</p>
              <p className="text-sm text-gray-500">Total Points</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{assessment.questions.length}</p>
              <p className="text-sm text-gray-500">Questions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {assessment.dueDate ? new Date(assessment.dueDate).toLocaleDateString() : 'No deadline'}
              </p>
              <p className="text-sm text-gray-500">Due Date</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Questions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Questions</CardTitle>
          {isInstructor && (
            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={openCreateQuestionModal}>
              Add Question
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {assessment.questions.length === 0 ? (
            <div className="text-center py-8">
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
              {isInstructor && (
                <Button onClick={openCreateQuestionModal} leftIcon={<Plus className="w-4 h-4" />}>
                  Add First Question
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {assessment.questions.map((question, index) => {
                const config = questionTypeConfig[question.type];
                const Icon = config.icon;

                return (
                  <div
                    key={question.id}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-sm font-medium text-gray-600 border border-gray-200">
                          {index + 1}
                        </span>
                        <div className={`w-10 h-10 ${config.bgColor} rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${config.color}`} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 font-medium mb-2">{question.text}</p>
                        {question.type === 'MCQ' && question.options && (
                          <div className="grid grid-cols-2 gap-2 mt-3">
                            {question.options.map((option, optIndex) => (
                              <div
                                key={optIndex}
                                className={`px-3 py-2 rounded-lg text-sm ${
                                  optIndex === question.correctOptionIndex
                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                    : 'bg-white text-gray-600 border border-gray-200'
                                }`}
                              >
                                {String.fromCharCode(65 + optIndex)}. {option}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-4 mt-3">
                          <Badge variant="default" size="sm">{config.label}</Badge>
                          <span className="text-sm text-gray-500">{question.score} points</span>
                        </div>
                      </div>
                      {isInstructor && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditQuestionModal(question)}
                            className="p-2 hover:bg-white rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(question.id)}
                            className="p-2 hover:bg-white rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Question Modal */}
      <Modal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        title={editingQuestion ? 'Edit Question' : 'Add Question'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmitQuestion)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['MCQ', 'ESSAY', 'CODING'] as QuestionType[]).map((type) => {
                const config = questionTypeConfig[type];
                const TypeIcon = config.icon;
                return (
                  <label
                    key={type}
                    className="relative flex flex-col items-center gap-2 p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 transition-colors"
                  >
                    <input
                      {...register('type', { required: 'Type is required' })}
                      type="radio"
                      value={type}
                      className="sr-only peer"
                    />
                    <div className={`w-10 h-10 ${config.bgColor} rounded-lg flex items-center justify-center`}>
                      <TypeIcon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <span className="text-xs font-medium text-gray-900">{config.label}</span>
                    <div className="absolute inset-0 rounded-lg peer-checked:border-2 peer-checked:border-primary-500 pointer-events-none" />
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('text', { required: 'Question text is required' })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter your question"
            />
            {errors.text && (
              <p className="mt-1 text-sm text-red-600">{errors.text.message}</p>
            )}
          </div>

          {questionType === 'MCQ' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {mcqOptions.map((option, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      {...register('correctOptionIndex')}
                      type="radio"
                      value={index}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-medium text-gray-600">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...mcqOptions];
                        newOptions[index] = e.target.value;
                        setMcqOptions(newOptions);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    />
                  </div>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">Select the correct answer</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Points <span className="text-red-500">*</span>
            </label>
            <input
              {...register('score', {
                required: 'Score is required',
                min: { value: 1, message: 'Score must be at least 1' },
              })}
              type="number"
              className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="10"
            />
            {errors.score && (
              <p className="mt-1 text-sm text-red-600">{errors.score.message}</p>
            )}
          </div>

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
