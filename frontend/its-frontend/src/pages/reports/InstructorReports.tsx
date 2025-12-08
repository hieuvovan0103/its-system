import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  Award,
  Calendar,
  Download,
  Filter,
  ChevronDown,
  ChevronUp,
  BarChart3,
  PieChart,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  Zap,
  BookOpen,
} from 'lucide-react';
import Button from '@/components/ui/Button';

// Mock data - Replace with API calls
const overviewStats = [
  {
    label: 'Total Students',
    value: '256',
    change: '+12%',
    trend: 'up',
    icon: Users,
    color: 'bg-blue-500',
    bgLight: 'bg-blue-50',
  },
  {
    label: 'Active Assessments',
    value: '18',
    change: '+3',
    trend: 'up',
    icon: ClipboardList,
    color: 'bg-purple-500',
    bgLight: 'bg-purple-50',
  },
  {
    label: 'Average Score',
    value: '78.5%',
    change: '+5.2%',
    trend: 'up',
    icon: TrendingUp,
    color: 'bg-emerald-500',
    bgLight: 'bg-emerald-50',
  },
  {
    label: 'Pass Rate',
    value: '85%',
    change: '-2%',
    trend: 'down',
    icon: Target,
    color: 'bg-amber-500',
    bgLight: 'bg-amber-50',
  },
];

const assessmentPerformance = [
  {
    id: 1,
    title: 'Python Basics Quiz',
    course: 'CS101',
    type: 'QUIZ',
    submissions: 45,
    avgScore: 82,
    passRate: 91,
    highestScore: 100,
    lowestScore: 45,
    dueDate: '2024-12-10',
  },
  {
    id: 2,
    title: 'Data Structures Exam',
    course: 'CS201',
    type: 'EXAM',
    submissions: 38,
    avgScore: 71,
    passRate: 79,
    highestScore: 98,
    lowestScore: 32,
    dueDate: '2024-12-15',
  },
  {
    id: 3,
    title: 'Algorithm Project',
    course: 'CS301',
    type: 'PROJECT',
    submissions: 28,
    avgScore: 85,
    passRate: 96,
    highestScore: 100,
    lowestScore: 60,
    dueDate: '2024-12-18',
  },
  {
    id: 4,
    title: 'Database Design Quiz',
    course: 'CS202',
    type: 'QUIZ',
    submissions: 52,
    avgScore: 76,
    passRate: 85,
    highestScore: 100,
    lowestScore: 40,
    dueDate: '2024-12-20',
  },
];

const topStudents = [
  { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', avgScore: 95, completedAssessments: 12, rank: 1 },
  { id: 2, name: 'Trần Thị B', email: 'tranthib@email.com', avgScore: 92, completedAssessments: 11, rank: 2 },
  { id: 3, name: 'Lê Văn C', email: 'levanc@email.com', avgScore: 89, completedAssessments: 12, rank: 3 },
  { id: 4, name: 'Phạm Thị D', email: 'phamthid@email.com', avgScore: 87, completedAssessments: 10, rank: 4 },
  { id: 5, name: 'Hoàng Văn E', email: 'hoangvane@email.com', avgScore: 85, completedAssessments: 12, rank: 5 },
];

const recentSubmissions = [
  { id: 1, student: 'Nguyễn Văn A', assessment: 'Python Basics Quiz', score: 95, maxScore: 100, submittedAt: '2 phút trước', status: 'passed' },
  { id: 2, student: 'Trần Thị B', assessment: 'Data Structures Exam', score: 68, maxScore: 100, submittedAt: '15 phút trước', status: 'passed' },
  { id: 3, student: 'Lê Văn C', assessment: 'Algorithm Project', score: 45, maxScore: 100, submittedAt: '1 giờ trước', status: 'failed' },
  { id: 4, student: 'Phạm Thị D', assessment: 'Database Design Quiz', score: 88, maxScore: 100, submittedAt: '2 giờ trước', status: 'passed' },
  { id: 5, student: 'Hoàng Văn E', assessment: 'Python Basics Quiz', score: 72, maxScore: 100, submittedAt: '3 giờ trước', status: 'passed' },
];

// Score distribution data for visualization
const scoreDistribution = [
  { range: '0-20', count: 5, percentage: 3 },
  { range: '21-40', count: 12, percentage: 7 },
  { range: '41-60', count: 35, percentage: 20 },
  { range: '61-80', count: 68, percentage: 40 },
  { range: '81-100', count: 52, percentage: 30 },
];

export default function InstructorReports() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'avgScore',
    direction: 'desc',
  });

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig.key !== column) return <ChevronDown className="w-4 h-4 text-gray-300" />;
    return sortConfig.direction === 'desc' 
      ? <ChevronDown className="w-4 h-4 text-indigo-600" />
      : <ChevronUp className="w-4 h-4 text-indigo-600" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-100';
    if (score >= 60) return 'bg-amber-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            Báo cáo & Thống kê
          </h1>
          <p className="text-gray-500 mt-1">
            Xem tổng quan hiệu suất học tập của sinh viên
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Period Filter */}
          <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1">
            {['week', 'month', 'semester'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  selectedPeriod === period
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {period === 'week' ? 'Tuần' : period === 'month' ? 'Tháng' : 'Học kỳ'}
              </button>
            ))}
          </div>

          {/* Export Button */}
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          return (
            <Card key={index} hover className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.bgLight} rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      stat.trend === 'up' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-red-50 text-red-700'
                    }`}>
                      <TrendIcon className="w-3 h-3" />
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </div>
                <div className={`h-1 ${stat.color}`} />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Assessment Performance Table */}
        <div className="xl:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Hiệu suất bài kiểm tra</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Thống kê chi tiết từng bài kiểm tra</p>
              </div>
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <Filter className="w-4 h-4" />
                Lọc
              </button>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-y border-gray-100">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Bài kiểm tra
                    </th>
                    <th 
                      className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('submissions')}
                    >
                      <div className="flex items-center justify-center gap-1">
                        Nộp bài
                        <SortIcon column="submissions" />
                      </div>
                    </th>
                    <th 
                      className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('avgScore')}
                    >
                      <div className="flex items-center justify-center gap-1">
                        Điểm TB
                        <SortIcon column="avgScore" />
                      </div>
                    </th>
                    <th 
                      className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('passRate')}
                    >
                      <div className="flex items-center justify-center gap-1">
                        Tỷ lệ đạt
                        <SortIcon column="passRate" />
                      </div>
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Cao/Thấp
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {assessmentPerformance.map((assessment) => (
                    <tr key={assessment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            assessment.type === 'QUIZ' ? 'bg-blue-100' :
                            assessment.type === 'EXAM' ? 'bg-red-100' : 'bg-purple-100'
                          }`}>
                            {assessment.type === 'QUIZ' ? (
                              <Zap className={`w-5 h-5 ${
                                assessment.type === 'QUIZ' ? 'text-blue-600' : ''
                              }`} />
                            ) : assessment.type === 'EXAM' ? (
                              <FileText className="w-5 h-5 text-red-600" />
                            ) : (
                              <BookOpen className="w-5 h-5 text-purple-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{assessment.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">{assessment.course}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                assessment.type === 'QUIZ' ? 'bg-blue-50 text-blue-700' :
                                assessment.type === 'EXAM' ? 'bg-red-50 text-red-700' : 
                                'bg-purple-50 text-purple-700'
                              }`}>
                                {assessment.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="font-semibold text-gray-900">{assessment.submissions}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg font-bold ${getScoreBg(assessment.avgScore)} ${getScoreColor(assessment.avgScore)}`}>
                          {assessment.avgScore}%
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                assessment.passRate >= 80 ? 'bg-emerald-500' :
                                assessment.passRate >= 60 ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${assessment.passRate}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{assessment.passRate}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-sm">
                          <span className="text-emerald-600 font-medium">{assessment.highestScore}</span>
                          <span className="text-gray-300">/</span>
                          <span className="text-red-600 font-medium">{assessment.lowestScore}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Score Distribution */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-indigo-600" />
                Phân bố điểm số
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">Tất cả bài kiểm tra</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {scoreDistribution.map((item, index) => {
                const colors = [
                  'bg-red-500',
                  'bg-orange-500', 
                  'bg-amber-500',
                  'bg-emerald-500',
                  'bg-indigo-500',
                ];
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">{item.range} điểm</span>
                      <span className="text-gray-500">{item.count} sinh viên ({item.percentage}%)</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${colors[index]} rounded-full transition-all duration-500`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              <div className="pt-4 mt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Tổng số bài nộp</span>
                  <span className="font-bold text-gray-900">172</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-500">Điểm trung bình</span>
                  <span className="font-bold text-indigo-600">78.5%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Students */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Top sinh viên xuất sắc
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">Dựa trên điểm trung bình</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {topStudents.map((student, index) => (
              <div 
                key={student.id}
                className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
                  index === 0 ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200' :
                  index === 1 ? 'bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200' :
                  index === 2 ? 'bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200' :
                  'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0 ? 'bg-amber-500 text-white' :
                  index === 1 ? 'bg-gray-400 text-white' :
                  index === 2 ? 'bg-orange-400 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {student.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{student.name}</p>
                  <p className="text-xs text-gray-500 truncate">{student.email}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${getScoreColor(student.avgScore)}`}>{student.avgScore}%</p>
                  <p className="text-xs text-gray-500">{student.completedAssessments} bài</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Submissions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Bài nộp gần đây
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">Cập nhật theo thời gian thực</p>
            </div>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              Xem tất cả
            </button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentSubmissions.map((submission) => (
              <div 
                key={submission.id}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  submission.status === 'passed' ? 'bg-emerald-100' : 'bg-red-100'
                }`}>
                  {submission.status === 'passed' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{submission.student}</p>
                  <p className="text-xs text-gray-500 truncate">{submission.assessment}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    submission.status === 'passed' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {submission.score}/{submission.maxScore}
                  </p>
                  <p className="text-xs text-gray-400">{submission.submittedAt}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Insights */}
      <Card className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <CardContent className="py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-white">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Thông tin nhanh
              </h3>
              <p className="text-white/80 text-sm mt-1">
                Tuần này có 45 bài nộp mới • 3 sinh viên cần hỗ trợ • 2 bài kiểm tra sắp đến hạn
              </p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-white text-indigo-600 hover:bg-white/90">
                Xem chi tiết
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Gửi nhắc nhở
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

