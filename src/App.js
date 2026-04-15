import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import AccommodationsPage from './pages/AccommodationsPage';
import TransportPage from './pages/TransportPage';
import FindBuddyPage from './pages/FindBuddyPage';
import JobsPage from './pages/JobsPage';
import HowItWorksPage from './pages/HowItWorksPage';
import BuddyProfilePage from './pages/BuddyProfilePage';
import BuddyRequestsPage from './pages/BuddyRequestsPage';
import UsersPage from './pages/UsersPage';
import RegisterBuddyPage from './pages/RegisterBuddyPage';
import BuddyInvitePage from './pages/BuddyInvitePage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Loading...</div>;
  return user ? children : <Navigate to="/landing" replace />;
}

function RoleRoute({ roles, children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/register-buddy/:token" element={<BuddyInvitePage />} />
      <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<HomePage />} />
        <Route path="accommodations" element={<AccommodationsPage />} />
        <Route path="transport" element={<TransportPage />} />
        <Route path="buddy" element={
          <RoleRoute roles={['student']}>
            <FindBuddyPage />
          </RoleRoute>
        } />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="how-it-works" element={<HowItWorksPage />} />
        <Route path="my-profile" element={
          <RoleRoute roles={['buddy']}>
            <BuddyProfilePage />
          </RoleRoute>
        } />
        <Route path="my-requests" element={
          <RoleRoute roles={['buddy']}>
            <BuddyRequestsPage />
          </RoleRoute>
        } />
        <Route path="users" element={
          <RoleRoute roles={['admin']}>
            <UsersPage />
          </RoleRoute>
        } />
        <Route path="register-buddy" element={
          <RoleRoute roles={['admin']}>
            <RegisterBuddyPage />
          </RoleRoute>
        } />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}