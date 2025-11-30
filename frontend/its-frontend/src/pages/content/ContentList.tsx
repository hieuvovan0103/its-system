import { useState, useEffect } from 'react';
import { contentService } from '@/services/contentService';
import type { Content, ContentFormData, ContentType } from '@/types';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useForm } from 'react-hook-form';
import {
  Plus,
  Search,
  Video,
  FileText,
  HelpCircle,
  Edit2,
  Trash2,
  ExternalLink,
  BookOpen,
  Layers,
  Sparkles,
  X,
} from 'lucide-react';

const contentTypeConfig: Record<ContentType, {
  icon: typeof Video;
  color: string;
  bgColor: string;
  borderColor: string;
  label: string;
  gradient: string;
}> = {
  VIDEO: {
    icon: Video,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    label: 'Video',
    gradient: 'from-rose-500 to-pink-500'
  },
  DOCUMENT: {
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    label: 'Document',
    gradient: 'from-blue-500 to-cyan-500'
  },
  QUIZ: {
    icon: HelpCircle,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    label: 'Quiz',
    gradient: 'from-emerald-500 to-teal-500'
  },
};

export default function ContentList() {
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<ContentType | 'ALL'>('ALL');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContentFormData>();

  useEffect(() => {
    loadContents();
  }, []);

  const loadContents = async () => {
    try {
      setIsLoading(true);
      const data = await contentService.getAll();
      setContents(data);
    } catch (error) {
      console.error('Failed to load contents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingContent(null);
    reset({
      title: '',
      topic: '',
      type: 'VIDEO',
      url: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (content: Content) => {
    setEditingContent(content);
    reset({
      title: content.title,
      topic: content.topic,
      type: content.type,
      url: content.url,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      await contentService.delete(id);
      setContents(contents.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Failed to delete content:', error);
    }
  };

  const onSubmit = async (data: ContentFormData) => {
    try {
      if (editingContent) {
        const updated = await contentService.update(editingContent.id, data);
        setContents(contents.map((c) => (c.id === editingContent.id ? updated : c)));
      } else {
        const created = await contentService.create(data);
        setContents([created, ...contents]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save content:', error);
    }
  };

  const filteredContents = contents.filter((content) => {
    const matchesSearch =
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'ALL' || content.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: contents.length,
    videos: contents.filter(c => c.type === 'VIDEO').length,
    documents: contents.filter(c => c.type === 'DOCUMENT').length,
    quizzes: contents.filter(c => c.type === 'QUIZ').length,
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">Content Management</h1>
              <p className="text-white/70 mt-1">Manage and organize your learning materials</p>
            </div>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-white/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-5 h-5" />
            Add Content
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Total Items</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.videos}</p>
              <p className="text-sm text-gray-500">Videos</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.documents}</p>
              <p className="text-sm text-gray-500">Documents</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.quizzes}</p>
              <p className="text-sm text-gray-500">Quizzes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or topic..."
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

          {/* Type Filter Buttons */}
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
            {(['VIDEO', 'DOCUMENT', 'QUIZ'] as ContentType[]).map((type) => {
              const config = contentTypeConfig[type];
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

      {/* Content Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gray-200 rounded-xl" />
                <div className="w-20 h-6 bg-gray-200 rounded-full" />
              </div>
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="h-10 bg-gray-200 rounded-lg" />
            </div>
          ))}
        </div>
      ) : filteredContents.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No content found</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {searchQuery || filterType !== 'ALL'
              ? 'Try adjusting your search or filter to find what you\'re looking for'
              : 'Get started by adding your first learning content'}
          </p>
          {!searchQuery && filterType === 'ALL' && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30"
            >
              <Plus className="w-5 h-5" />
              Add Your First Content
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContents.map((content) => {
            const config = contentTypeConfig[content.type];
            const Icon = config.icon;
            const isHovered = hoveredCard === content.id;

            return (
              <div
                key={content.id}
                onMouseEnter={() => setHoveredCard(content.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`group bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                  isHovered
                    ? `${config.borderColor} shadow-xl -translate-y-1`
                    : 'border-gray-100 shadow-sm hover:shadow-lg'
                }`}
              >
                {/* Card Header with Gradient */}
                <div className={`h-2 bg-gradient-to-r ${config.gradient}`} />

                <div className="p-6">
                  {/* Icon and Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 ${config.bgColor} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                      <Icon className={`w-7 h-7 ${config.color}`} />
                    </div>
                    <span className={`px-3 py-1 ${config.bgColor} ${config.color} text-xs font-semibold rounded-full`}>
                      {config.label}
                    </span>
                  </div>

                  {/* Title and Topic */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {content.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    {content.topic}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <a
                      href={content.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r ${config.gradient} text-white font-medium rounded-xl hover:opacity-90 transition-opacity shadow-sm`}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open
                    </a>
                    <button
                      onClick={() => openEditModal(content)}
                      className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(content.id)}
                      className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-red-100 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingContent ? 'Edit Content' : 'Add New Content'}
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
              placeholder="Enter content title"
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Topic <span className="text-red-500">*</span>
            </label>
            <input
              {...register('topic', { required: 'Topic is required' })}
              type="text"
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
              placeholder="e.g., Python Basics, Data Structures"
            />
            {errors.topic && (
              <p className="mt-2 text-sm text-red-600">{errors.topic.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Content Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['VIDEO', 'DOCUMENT', 'QUIZ'] as ContentType[]).map((type) => {
                const config = contentTypeConfig[type];
                const TypeIcon = config.icon;
                return (
                  <label
                    key={type}
                    className="relative flex flex-col items-center gap-2 p-4 bg-gray-50 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 transition-all peer-checked:border-indigo-500"
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
              URL <span className="text-red-500">*</span>
            </label>
            <input
              {...register('url', {
                required: 'URL is required',
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: 'Please enter a valid URL',
                },
              })}
              type="url"
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
              placeholder="https://example.com/content"
            />
            {errors.url && (
              <p className="mt-2 text-sm text-red-600">{errors.url.message}</p>
            )}
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
              {editingContent ? 'Save Changes' : 'Create Content'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
