import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assessmentService } from '@/services/assessmentService';
import type { Assessment, AssessmentFormData, AssessmentType } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button'; 
import Modal from '@/components/ui/Modal';   
import { useForm } from 'react-hook-form';
import {
  Plus,
  Search,
  ClipboardList,
  FileCheck,
  FolderKanban,
  Clock,
  Award,
  X,
  Sparkles,
  Calendar,
  AlertCircle,
  Eye,       
  Users,     
  Edit2,     
  Trash2,    
  Play      
} from 'lucide-react';

const assessmentTypeConfig: Record<AssessmentType, {
  icon: typeof ClipboardList;
  color: string;
  bgColor: string;
  borderColor: string;
  label: string;
  gradient: string;
}> = {
  QUIZ: {
    icon: ClipboardList,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    label: 'Quiz',
    gradient: 'from-blue-500 to-indigo-500'
  },
  EXAM: {
    icon: FileCheck,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    label: 'Exam',
    gradient: 'from-rose-500 to-pink-500'
  },
  PROJECT: {
    icon: FolderKanban,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    label: 'Project',
    gradient: 'from-purple-500 to-violet-500'
  },
};

export default function AssessmentList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<AssessmentType | 'ALL'>('ALL');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const isInstructor = user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AssessmentFormData>();

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      setIsLoading(true);
      const data = await assessmentService.getAll();
      setAssessments(data);
    } catch (error) {
      console.error('Failed to load assessments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingAssessment(null);
    reset({
      title: '',
      description: '',
      type: 'QUIZ',
      courseId: 1, 
      dueDate: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (assessment: Assessment, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAssessment(assessment);
    reset({
      title: assessment.title,
      description: assessment.description,
      type: assessment.type,
      courseId: assessment.courseId,
      dueDate: assessment.dueDate ? assessment.dueDate.split('T')[0] : '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this assessment?')) return;

    try {
      await assessmentService.delete(id);
      setAssessments(assessments.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Failed to delete assessment:', error);
    }
  };

  const onSubmit = async (data: AssessmentFormData) => {
    try {
      const payload = {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined
      };

      if (editingAssessment) {
        const updated = await assessmentService.update(editingAssessment.id, payload);
        setAssessments(assessments.map((a) => (a.id === editingAssessment.id ? updated : a)));
      } else {
        const created = await assessmentService.create(payload);
        setAssessments([created, ...assessments]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save assessment:', error);
      alert('Failed to save assessment');
    }
  };

  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch =
        assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assessment.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'ALL' || assessment.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getDaysUntilDue = (dueDate?: string) => {
    if (!dueDate) return null;
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const stats = {
    total: assessments.length,
    quizzes: assessments.filter(a => a.type === 'QUIZ').length,
    exams: assessments.filter(a => a.type === 'EXAM').length,
    projects: assessments.filter(a => a.type === 'PROJECT').length,
  };

  return (
      <div className="space-y-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <ClipboardList className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white">Assessments</h1>
                <p className="text-white/70 mt-1">
                  {isInstructor ? 'Create and manage assessments' : 'View and complete your assessments'}
                </p>
              </div>
            </div>

            {isInstructor && (
                <button
                    onClick={openCreateModal}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-white/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Plus className="w-5 h-5" />
                  Create Assessment
                </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-500">Total</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.quizzes}</p>
                <p className="text-sm text-gray-500">Quizzes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.exams}</p>
                <p className="text-sm text-gray-500">Exams</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                <FolderKanban className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.projects}</p>
                <p className="text-sm text-gray-500">Projects</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                  type="text"
                  placeholder="Search assessments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-gray-900 placeholder:text-gray-400"
              />
              {searchQuery && (
                  <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                  onClick={() => setFilterType('ALL')}
                  className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                      filterType === 'ALL'
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                All
              </button>
              {(['QUIZ', 'EXAM', 'PROJECT'] as AssessmentType[]).map((type) => {
                const config = assessmentTypeConfig[type];
                return (
                    <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                            filterType === type
                                ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg`
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      {config.label}
                    </button>
                );
              })}
            </div>
          </div>
        </div>

        {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-xl" />
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-1/4" />
                      </div>
                    </div>
                  </div>
              ))}
            </div>
        ) : filteredAssessments.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No assessments found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchQuery || filterType !== 'ALL'
                    ? 'Try adjusting your search or filter to find what you\'re looking for'
                    : isInstructor
                        ? 'Get started by creating your first assessment'
                        : 'No assessments available yet'}
              </p>
              {isInstructor && !searchQuery && filterType === 'ALL' && (
                  <button
                      onClick={openCreateModal}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30"
                  >
                    <Plus className="w-5 h-5" />
                    Create Your First Assessment
                  </button>
              )}
            </div>
        ) : (
            <div className="space-y-4">
              {filteredAssessments.map((assessment) => {
                const config = assessmentTypeConfig[assessment.type];
                const Icon = config.icon;
                const daysUntilDue = getDaysUntilDue(assessment.dueDate);
                const isHovered = hoveredCard === assessment.id;

                return (
                    <div
                        key={assessment.id}
                        onClick={() => navigate(`/assessments/${assessment.id}`)}
                        onMouseEnter={() => setHoveredCard(assessment.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        className={`group bg-white rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
                            isHovered
                                ? `${config.borderColor} shadow-xl`
                                : 'border-gray-100 shadow-sm hover:shadow-lg'
                        }`}
                    >
                      <div className="flex items-center gap-5 p-5">
                        {/* Icon */}
                        <div className={`w-16 h-16 bg-gradient-to-br ${config.gradient} rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                              {assessment.title}
                            </h3>
                            <span className={`px-3 py-1 ${config.bgColor} ${config.color} text-xs font-semibold rounded-full`}>
                        {config.label}
                      </span>
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-1 mb-3">
                            {assessment.description}
                          </p>
                          <div className="flex items-center gap-5 text-sm">
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <Award className="w-4 h-4 text-amber-500" />
                        {/* Xử lý hiển thị nếu totalScore chưa có */}
                        <span className="font-medium">{assessment.totalScore || 0}</span> points
                      </span>
                            <span className="flex items-center gap-1.5 text-gray-500">
                        <ClipboardList className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">{assessment.questions?.length || 0}</span> questions
                      </span>
                            {daysUntilDue !== null && (
                                <span className={`flex items-center gap-1.5 ${
                                    daysUntilDue < 0 ? 'text-red-500' :
                                        daysUntilDue <= 3 ? 'text-amber-500' : 'text-gray-500'
                                }`}>
                          {daysUntilDue < 0 ? (
                              <AlertCircle className="w-4 h-4" />
                          ) : daysUntilDue <= 3 ? (
                              <Clock className="w-4 h-4" />
                          ) : (
                              <Calendar className="w-4 h-4 text-green-500" />
                          )}
                                  <span className="font-medium">
                            {daysUntilDue < 0
                                ? 'Overdue'
                                : daysUntilDue === 0
                                    ? 'Due today'
                                    : `${daysUntilDue} days left`}
                          </span>
                        </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {!isInstructor ? (
                              <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/assessments/${assessment.id}/take`);
                                  }}
                                  className={`flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${config.gradient} text-white font-medium rounded-xl hover:opacity-90 transition-all shadow-md`}
                              >
                                <Play className="w-4 h-4" />
                                Take
                              </button>
                          ) : (
                              <>
                                <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/assessments/${assessment.id}`);
                                    }}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                  View
                                </button>
                                <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/assessments/${assessment.id}/submissions`);
                                    }}
                                    className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-purple-100 hover:text-purple-600 transition-colors"
                                    title="Submissions"
                                >
                                  <Users className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={(e) => openEditModal(assessment, e)}
                                    className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
                                    title="Edit"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={(e) => handleDelete(assessment.id, e)}
                                    className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-red-100 hover:text-red-600 transition-colors"
                                    title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                          )}
                        </div>
                      </div>
                    </div>
                );
              })}
            </div>
        )}

        <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={editingAssessment ? 'Edit Assessment' : 'Create Assessment'}
            size="lg"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                  {...register('title', { required: 'Title is required' })}
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                  placeholder="Enter assessment title"
              />
              {errors.title && (
                  <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                  {...register('description', { required: 'Description is required' })}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none"
                  placeholder="Enter assessment description"
              />
              {errors.description && (
                  <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Assessment Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['QUIZ', 'EXAM', 'PROJECT'] as AssessmentType[]).map((type) => {
                  const config = assessmentTypeConfig[type];
                  const TypeIcon = config.icon;
                  return (
                      <label
                          key={type}
                          className="relative flex flex-col items-center gap-2 p-4 bg-gray-50 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 transition-all"
                      >
                        <input
                            {...register('type', { required: 'Type is required' })}
                            type="radio"
                            value={type}
                            className="sr-only peer"
                        />
                        <div className={`w-12 h-12 bg-gradient-to-br ${config.gradient} rounded-xl flex items-center justify-center shadow-sm`}>
                          <TypeIcon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{config.label}</span>
                        <div className="absolute inset-0 rounded-xl border-2 border-transparent peer-checked:border-indigo-500 peer-checked:bg-indigo-50/50 pointer-events-none" />
                      </label>
                  );
                })}
              </div>
              {errors.type && (
                  <p className="mt-2 text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Due Date
              </label>
              <input
                  {...register('dueDate')}
                  type="date"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                {editingAssessment ? 'Save Changes' : 'Create Assessment'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
  );
}