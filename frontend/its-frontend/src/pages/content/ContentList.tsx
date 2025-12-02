import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { courseService } from '@/services/courseService';
import { contentService } from '@/services/contentService';
import type { Course, Content, CourseFormData, ContentFormData, ContentType } from '@/types';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import {
  Plus, Video, FileText, HelpCircle, Edit2, Trash2,
  ExternalLink, BookOpen, Layers, FolderPlus, Loader2,
  AlertTriangle, RefreshCw // 🆕 Thêm Icon báo lỗi và refresh
} from 'lucide-react';

const contentTypeConfig: Record<ContentType, { icon: any; color: string; bgColor: string; label: string }> = {
  VIDEO: { icon: Video, color: 'text-rose-600', bgColor: 'bg-rose-50', label: 'Video' },
  DOCUMENT: { icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-50', label: 'Document' },
  QUIZ: { icon: HelpCircle, color: 'text-emerald-600', bgColor: 'bg-emerald-50', label: 'Quiz' },
};

export default function ContentList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [contents, setContents] = useState<Content[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 🆕 State lưu lỗi server
  const [serverError, setServerError] = useState<string | null>(null);

  // Modal States
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingContent, setEditingContent] = useState<Content | null>(null);

  // Forms
  const {
    register: regCourse,
    handleSubmit: handleCourseSubmit,
    reset: resetCourse,
    formState: { errors: errCourse, isSubmitting: isCourseSubmitting }
  } = useForm<CourseFormData>();

  const {
    register: regContent,
    handleSubmit: handleContentSubmit,
    reset: resetContent,
    formState: { errors: errContent, isSubmitting: isContentSubmitting }
  } = useForm<ContentFormData>();

  // 1. Load Courses
  useEffect(() => {
    loadCourses();
  }, []);

  // 2. Load Contents khi đổi Course
  useEffect(() => {
    if (selectedCourseId) {
      loadContents(selectedCourseId);
    } else {
      setContents([]);
    }
  }, [selectedCourseId]);

  const loadCourses = async () => {
    try {
      setServerError(null); // Reset lỗi cũ
      const data = await courseService.getAll();
      setCourses(data);
      if (data.length > 0 && !selectedCourseId) {
        setSelectedCourseId(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load courses', error);
      // 🆕 Báo lỗi nếu không tải được khóa học
      setServerError("Không thể kết nối đến Content Service. Vui lòng kiểm tra server.");
    }
  };

  const loadContents = async (courseId: number) => {
    setIsLoading(true);
    setServerError(null); // Reset lỗi
    try {
      const data = await contentService.getByCourse(courseId);
      setContents(data);
    } catch (error) {
      console.error('Failed to load contents', error);
      // 🆕 Báo lỗi nếu không tải được bài học
      setServerError("Dịch vụ bài giảng đang gặp sự cố. Không thể tải dữ liệu.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- COURSE HANDLERS ---
  const onCourseSubmit = async (data: CourseFormData) => {
    try {
      if (editingCourse) {
        await courseService.update(editingCourse.id, data);
      } else {
        await courseService.create(data);
      }
      setIsCourseModalOpen(false);
      loadCourses();
    } catch (error) {
      console.error('Error saving course', error);
      alert('Failed to save course. Service might be down.');
    }
  };

  const handleDeleteCourse = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this course and all its contents?')) return;
    try {
      await courseService.delete(id);
      loadCourses();
      if (selectedCourseId === id) setSelectedCourseId(null);
    } catch (error) {
      console.error('Error deleting course', error);
      alert('Failed to delete course. Service might be down.');
    }
  };

  // --- CONTENT HANDLERS ---
  const openCreateContent = () => {
    if (!selectedCourseId) return alert("Please select a course first!");
    setEditingContent(null);
    resetContent({
      title: '',
      type: 'VIDEO',
      url: '',
      courseId: selectedCourseId
    });
    setIsContentModalOpen(true);
  };

  const onContentSubmit = async (data: ContentFormData) => {
    try {
      const payload = {
        ...data,
        courseId: Number(selectedCourseId)
      };

      if (editingContent) {
        await contentService.update(editingContent.id, payload);
      } else {
        await contentService.create(payload);
      }
      setIsContentModalOpen(false);
      if (selectedCourseId) loadContents(selectedCourseId);
    } catch (error) {
      console.error('Error saving content', error);
      alert('Failed to save content. Service might be down.');
    }
  };

  const handleDeleteContent = async (id: number) => {
    if (!confirm('Delete this content?')) return;
    try {
      await contentService.delete(id);
      if (selectedCourseId) loadContents(selectedCourseId);
    } catch (error) {
      console.error('Error deleting content', error);
      alert('Failed to delete content.');
    }
  };

  // 🆕 Hàm thử lại khi lỗi
  const handleRetry = () => {
    setServerError(null);
    loadCourses();
    if (selectedCourseId) loadContents(selectedCourseId);
  };

  return (
      <div className="flex h-[calc(100vh-theme(spacing.24))] gap-6">

        {/* LEFT PANEL: COURSES */}
        <div className="w-1/3 flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
            <h2 className="font-bold text-gray-700 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Courses
            </h2>
            <button
                onClick={() => { setEditingCourse(null); resetCourse({ title: '', description: '' }); setIsCourseModalOpen(true); }}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {courses.map(course => (
                <div
                    key={course.id}
                    onClick={() => setSelectedCourseId(course.id)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border group ${
                        selectedCourseId === course.id
                            ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                            : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-200'
                    }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0 pr-2">
                      <h3 className={`font-semibold truncate ${selectedCourseId === course.id ? 'text-indigo-700' : 'text-gray-900'}`}>
                        {course.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{course.description}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                          onClick={(e) => { e.stopPropagation(); setEditingCourse(course); resetCourse(course); setIsCourseModalOpen(true); }}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-md"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                          onClick={(e) => handleDeleteCourse(course.id, e)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-md"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
            ))}

            {courses.length === 0 && !serverError && (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm">
                  <BookOpen className="w-8 h-8 mb-2 opacity-20" />
                  <p>No courses yet.</p>
                </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: CONTENTS */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative">

          {/* 🆕 HIỂN THỊ LỖI SERVER TRÙM LÊN CONTENT PANEL */}
          {serverError ? (
              <div className="absolute inset-0 z-10 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-red-100">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Service Unavailable</h3>
                <p className="text-gray-500 max-w-md mb-6">{serverError}</p>
                <Button onClick={handleRetry} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry Connection
                </Button>
              </div>
          ) : null}

          {selectedCourseId ? (
              <>
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {courses.find(c => c.id === selectedCourseId)?.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      {contents.length} learning items
                    </p>
                  </div>
                  <Button onClick={openCreateContent}>
                    <Plus className="w-4 h-4 mr-2" /> Add Content
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
                  {isLoading ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <Loader2 className="w-8 h-8 animate-spin mb-2 text-indigo-500" />
                        <p>Loading contents...</p>
                      </div>
                  ) : contents.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <Layers className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg font-medium">This course is empty</p>
                        <p className="text-sm">Click "Add Content" to get started</p>
                      </div>
                  ) : (
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {contents.map((content) => {
                          const config = contentTypeConfig[content.type];
                          const Icon = config.icon;
                          return (
                              <div key={content.id} className="group bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex gap-4">
                                <div className={`w-12 h-12 ${config.bgColor} rounded-xl flex items-center justify-center shrink-0`}>
                                  <Icon className={`w-6 h-6 ${config.color}`} />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                  <div className="flex justify-between items-start">
                                    <h4 className="font-semibold text-gray-900 truncate pr-2" title={content.title}>
                                      {content.title}
                                    </h4>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button
                                          onClick={() => { setEditingContent(content); resetContent({...content, courseId: selectedCourseId}); setIsContentModalOpen(true); }}
                                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                                      >
                                        <Edit2 className="w-4 h-4" />
                                      </button>
                                      <button
                                          onClick={() => handleDeleteContent(content.id)}
                                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between mt-2">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bgColor} ${config.color} border border-transparent`}>
                              {config.label}
                            </span>
                                    <a
                                        href={content.url} target="_blank" rel="noreferrer"
                                        className="text-xs text-gray-400 flex items-center gap-1 hover:text-indigo-600 hover:underline max-w-[150px] truncate"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                      Link
                                    </a>
                                  </div>
                                </div>
                              </div>
                          );
                        })}
                      </div>
                  )}
                </div>
              </>
          ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50/50">
                <FolderPlus className="w-20 h-20 mb-4 opacity-10 text-indigo-600" />
                <p className="text-xl font-medium text-gray-600">Select a course</p>
                <p className="text-sm mt-1">Choose a course from the left to manage its content</p>
              </div>
          )}
        </div>

        {/* --- MODAL COURSE (Giữ nguyên) --- */}
        <Modal
            isOpen={isCourseModalOpen}
            onClose={() => setIsCourseModalOpen(false)}
            title={editingCourse ? 'Edit Course' : 'Create New Course'}
        >
          <form onSubmit={handleCourseSubmit(onCourseSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Course Title</label>
              <input
                  {...regCourse('title', { required: true })}
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g. Java Fundamentals"
              />
              {errCourse.title && <span className="text-red-500 text-xs mt-1">Title is required</span>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
              <textarea
                  {...regCourse('description')}
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Short description about this course..."
                  rows={4}
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="outline" onClick={() => setIsCourseModalOpen(false)}>Cancel</Button>
              <Button type="submit" isLoading={isCourseSubmitting}>
                {editingCourse ? 'Save Changes' : 'Create Course'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* --- MODAL CONTENT (Giữ nguyên) --- */}
        <Modal
            isOpen={isContentModalOpen}
            onClose={() => setIsContentModalOpen(false)}
            title={editingContent ? 'Edit Content' : 'Add Content'}
        >
          <form onSubmit={handleContentSubmit(onContentSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Title</label>
              <input
                  {...regContent('title', { required: true })}
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="Lesson title"
              />
              {errContent.title && <span className="text-red-500 text-xs mt-1">Title is required</span>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Type</label>
              <div className="grid grid-cols-3 gap-3">
                {['VIDEO', 'DOCUMENT', 'QUIZ'].map(type => (
                    <label
                        key={type}
                        className={`
                    border rounded-lg p-3 text-center cursor-pointer transition-all
                    ${regContent('type') ? '' : ''}
                    hover:bg-gray-50
                    has-[:checked]:bg-indigo-50 has-[:checked]:border-indigo-500 has-[:checked]:text-indigo-700
                  `}
                    >
                      <input {...regContent('type')} type="radio" value={type} className="sr-only" />
                      <span className="text-sm font-semibold">{type}</span>
                    </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">URL / Link</label>
              <input
                  {...regContent('url', { required: true })}
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="https://..."
              />
              {errContent.url && <span className="text-red-500 text-xs mt-1">URL is required</span>}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="outline" onClick={() => setIsContentModalOpen(false)}>Cancel</Button>
              <Button type="submit" isLoading={isContentSubmitting}>
                {editingContent ? 'Save Changes' : 'Add Content'}
              </Button>
            </div>
          </form>
        </Modal>

      </div>
  );
}