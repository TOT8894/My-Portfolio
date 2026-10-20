import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PortfolioHome from './pages/PortfolioHome';
import DetailPage from './pages/DetailPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminForgotPassword from './pages/admin/AdminForgotPassword';
import AdminResetPassword from './pages/admin/AdminResetPassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/admin/ProtectedRoute';
import { PortfolioProvider } from './context/PortfolioContext';
import { AuthProvider } from './context/AuthContext';

function PublicLayout({ darkMode, setDarkMode }) {
  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-white dark:bg-black text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 overflow-x-hidden`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <Outlet />
      <Footer />
    </div>
  );
}

export default function App() {
  // Day mode (light theme) is the default mode
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark'; // Defaults to false (day mode) if not set
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <AuthProvider>
      <PortfolioProvider>
        <Router>
          <Routes>
            {/* Public Portfolio with Layout */}
            <Route element={<PublicLayout darkMode={darkMode} setDarkMode={setDarkMode} />}>
              <Route path="/" element={<PortfolioHome />} />
              {/* Dedicated Full Page Detail View (No pop-up / modal!) */}
              <Route path="/details/:type/:id" element={<DetailPage />} />
            </Route>

            {/* Admin Authentication Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
            <Route path="/admin/reset-password/:token" element={<AdminResetPassword />} />

            {/* Admin Dashboard Protected Route */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Default fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </PortfolioProvider>
    </AuthProvider>
  );
}
