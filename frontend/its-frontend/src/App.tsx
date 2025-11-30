import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';

// Layout
import Layout from '@/components/layout/Layout';

// Auth pages
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';

// Main pages
import Dashboard from '@/pages/Dashboard';
import Settings from '@/pages/Settings';

// Content pages
import ContentList from '@/pages/content/ContentList';

// Assessment pages
import AssessmentList from '@/pages/assessment/AssessmentList';
import AssessmentDetail from '@/pages/assessment/AssessmentDetail';
import TakeAssessment from '@/pages/assessment/TakeAssessment';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />

              {/* Content Management */}
              <Route path="content" element={<ContentList />} />

              {/* Assessments */}
              <Route path="assessments" element={<AssessmentList />} />
              <Route path="assessments/:id" element={<AssessmentDetail />} />
              <Route path="assessments/:id/take" element={<TakeAssessment />} />

              {/* Settings */}
              <Route path="settings" element={<Settings />} />

              {/* Placeholder routes */}
              <Route path="learning" element={<PlaceholderPage title="My Learning" />} />
              <Route path="students" element={<PlaceholderPage title="Students" />} />
              <Route path="reports" element={<PlaceholderPage title="Reports" />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

// Placeholder component for routes not yet implemented
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500">This page is coming soon</p>
      </div>
    </div>
  );
}
