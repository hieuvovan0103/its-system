import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  BookOpen,
  LayoutDashboard,
  FileText,
  ClipboardList,
  Users,
  BarChart3,
  Settings,
  GraduationCap,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['STUDENT', 'INSTRUCTOR', 'ADMIN'],
    },
    {
      title: 'Content',
      path: '/content',
      icon: FileText,
      roles: ['INSTRUCTOR', 'ADMIN'],
    },
    {
      title: 'Assessments',
      path: '/assessments',
      icon: ClipboardList,
      roles: ['STUDENT', 'INSTRUCTOR', 'ADMIN'],
    },
    {
      title: 'My Learning',
      path: '/learning',
      icon: GraduationCap,
      roles: ['STUDENT'],
    },
    {
      title: 'Students',
      path: '/students',
      icon: Users,
      roles: ['INSTRUCTOR', 'ADMIN'],
    },
    {
      title: 'Reports',
      path: '/reports',
      icon: BarChart3,
      roles: ['INSTRUCTOR', 'ADMIN'],
    },
    {
      title: 'Settings',
      path: '/settings',
      icon: Settings,
      roles: ['STUDENT', 'INSTRUCTOR', 'ADMIN'],
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-gray-100">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">ITS</span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  active
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 font-medium shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                  active
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-500 shadow-md shadow-indigo-500/30'
                    : 'bg-gray-100 group-hover:bg-gray-200'
                }`}>
                  <Icon
                    className={`w-5 h-5 ${
                      active ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                    }`}
                  />
                </div>
                <span className="text-sm">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* User role badge */}
        {user && (
          <div className="px-3 py-4 border-t border-gray-100">
            <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Role</p>
              <p className="text-sm font-semibold text-gray-700 mt-0.5">{user.role}</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
