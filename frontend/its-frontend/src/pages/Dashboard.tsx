import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/Card';
import {
  BookOpen,
  ClipboardList,
  Users,
  TrendingUp,
  FileText,
  GraduationCap,
  Award,
  Clock,
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

  const instructorStats = [
    { label: 'Total Courses', value: '12', icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Active Students', value: '256', icon: Users, color: 'bg-green-500' },
    { label: 'Assessments', value: '48', icon: ClipboardList, color: 'bg-purple-500' },
    { label: 'Avg. Score', value: '78%', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  const studentStats = [
    { label: 'Enrolled Courses', value: '5', icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Completed', value: '3', icon: GraduationCap, color: 'bg-green-500' },
    { label: 'Pending Tasks', value: '8', icon: Clock, color: 'bg-yellow-500' },
    { label: 'Achievements', value: '12', icon: Award, color: 'bg-purple-500' },
  ];

  const stats = user?.role === 'STUDENT' ? studentStats : instructorStats;

  const recentActivities = [
    {
      id: 1,
      title: 'Python Basics Quiz submitted',
      description: 'Score: 85/100',
      time: '2 hours ago',
      type: 'assessment',
    },
    {
      id: 2,
      title: 'New content added: Data Structures',
      description: 'Video tutorial - 45 minutes',
      time: '5 hours ago',
      type: 'content',
    },
    {
      id: 3,
      title: 'Algorithm Project graded',
      description: 'Feedback available',
      time: '1 day ago',
      type: 'grade',
    },
    {
      id: 4,
      title: 'New assessment assigned',
      description: 'Database Design Exam - Due in 3 days',
      time: '2 days ago',
      type: 'assessment',
    },
  ];

  const upcomingDeadlines = [
    { id: 1, title: 'Data Structures Exam', course: 'CS201', dueDate: 'Dec 15, 2024', type: 'EXAM' },
    { id: 2, title: 'Algorithm Project', course: 'CS301', dueDate: 'Dec 18, 2024', type: 'PROJECT' },
    { id: 3, title: 'Python Quiz 5', course: 'CS101', dueDate: 'Dec 20, 2024', type: 'QUIZ' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your learning journey today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} hover>
              <CardContent className="flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <CardContent className="divide-y divide-gray-100">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'assessment' ? 'bg-purple-100' :
                      activity.type === 'content' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {activity.type === 'assessment' ? (
                        <ClipboardList className={`w-5 h-5 ${
                          activity.type === 'assessment' ? 'text-purple-600' : ''
                        }`} />
                      ) : activity.type === 'content' ? (
                        <FileText className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Award className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Deadlines */}
        <div>
          <Card>
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h2>
            </div>
            <CardContent className="space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      deadline.type === 'EXAM' ? 'bg-red-100 text-red-700' :
                      deadline.type === 'PROJECT' ? 'bg-purple-100 text-purple-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {deadline.type}
                    </span>
                    <span className="text-xs text-gray-500">{deadline.course}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{deadline.title}</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {deadline.dueDate}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <CardContent className="grid grid-cols-2 gap-3">
              {user?.role !== 'STUDENT' && (
                <>
                  <button className="p-4 bg-primary-50 hover:bg-primary-100 rounded-xl text-center transition-colors">
                    <FileText className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-primary-700">Add Content</span>
                  </button>
                  <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-center transition-colors">
                    <ClipboardList className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-purple-700">New Assessment</span>
                  </button>
                </>
              )}
              {user?.role === 'STUDENT' && (
                <>
                  <button className="p-4 bg-primary-50 hover:bg-primary-100 rounded-xl text-center transition-colors">
                    <BookOpen className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-primary-700">My Courses</span>
                  </button>
                  <button className="p-4 bg-green-50 hover:bg-green-100 rounded-xl text-center transition-colors">
                    <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <span className="text-sm font-medium text-green-700">My Progress</span>
                  </button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
