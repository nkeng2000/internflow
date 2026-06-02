import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider, useData } from './contexts/DataContext';

import LandingPage from './pages/LandingPage';
import Toaster from './components/Toaster';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import SetupPage from './pages/SetupPage';
import StudentPages from './pages/student/StudentPages';
import CompanyPages from './pages/company/CompanyPages';
import SupervisorPages from './pages/supervisor/SupervisorPages';
import AdminPages from './pages/admin/AdminPages';

// ============================================================
// Auth-aware redirect wrapper
// ============================================================
const AuthRedirect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'admin': navigate('/admin'); break;
        case 'student': navigate('/student'); break;
        case 'company': navigate('/company'); break;
        case 'supervisor': navigate('/supervisor'); break;
      }
    }
  }, [user, navigate]);

  return <>{children}</>;
};

// ============================================================
// Protected Route
// ============================================================
const ProtectedRoute: React.FC<{ children: React.ReactNode; role: string }> = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
};

// ============================================================
// App
// ============================================================
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<AuthRedirect><LandingPage /></AuthRedirect>} />
      <Route path="/setup" element={<SetupPage />} />
      <Route path="/login" element={<AuthRedirect><LoginPage /></AuthRedirect>} />
      <Route path="/register" element={<AuthRedirect><RegisterPage /></AuthRedirect>} />

      {/* Role-based routes */}
      <Route path="/student/*" element={<ProtectedRoute role="student"><StudentPages /></ProtectedRoute>} />
      <Route path="/company/*" element={<ProtectedRoute role="company"><CompanyPages /></ProtectedRoute>} />
      <Route path="/supervisor/*" element={<ProtectedRoute role="supervisor"><SupervisorPages /></ProtectedRoute>} />
      <Route path="/admin/*" element={<ProtectedRoute role="admin"><AdminPages /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Shows a loading screen until Supabase data has loaded, then the app.
const AppGate: React.FC = () => {
  const { loading: authLoading } = useAuth();
  const { loading: dataLoading } = useData();
  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg mb-4">IF</div>
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-500 mt-4">Connecting to InternFlow…</p>
      </div>
    );
  }
  return <AppRoutes />;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <DataProvider>
          <AppGate />
          <Toaster />
        </DataProvider>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
