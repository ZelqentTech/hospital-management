/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { ToastProvider } from './contexts/ToastContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { PatientDashboard } from './pages/PatientDashboard';
import { DoctorDirectory } from './pages/DoctorDirectory';
import { BookingFlow } from './pages/BookingFlow';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminDoctorManagement } from './pages/AdminDoctorManagement';
import { ReportsPage } from './pages/ReportsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AboutUs } from './pages/AboutUs';
import { Contact } from './pages/Contact';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';

function AppRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        user ? (
          <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <Navbar />
              <main className="flex-1 overflow-y-auto p-8">
                {user.role === 'patient' && <PatientDashboard />}
                {user.role === 'doctor' && <DoctorDashboard />}
                {user.role === 'admin' && <AdminDashboard />}
              </main>
            </div>
          </div>
        ) : <Navigate to="/login" />
      } />

      <Route path="/reports" element={
        user ? (
          <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <Navbar />
              <main className="flex-1 overflow-y-auto p-8">
                <ReportsPage />
              </main>
            </div>
          </div>
        ) : <Navigate to="/login" />
      } />

      <Route path="/profile" element={
        user ? (
          <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <Navbar />
              <main className="flex-1 overflow-y-auto p-8">
                <ProfilePage />
              </main>
            </div>
          </div>
        ) : <Navigate to="/login" />
      } />

      <Route path="/doctors" element={
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-y-auto p-8">
              <DoctorDirectory />
            </main>
          </div>
        </div>
      } />

      <Route path="/about" element={
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-y-auto p-8">
              <AboutUs />
            </main>
          </div>
        </div>
      } />

      <Route path="/contact" element={
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-y-auto p-8">
              <Contact />
            </main>
          </div>
        </div>
      } />

      <Route path="/book/:doctorId" element={
        user ? (
          <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <Navbar />
              <main className="flex-1 overflow-y-auto p-8">
                <BookingFlow />
              </main>
            </div>
          </div>
        ) : <Navigate to="/login" />
      } />

      <Route path="/admin/doctors" element={
        user?.role === 'admin' ? (
          <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <Navbar />
              <main className="flex-1 overflow-y-auto p-8">
                <AdminDoctorManagement />
              </main>
            </div>
          </div>
        ) : <Navigate to="/dashboard" />
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <SocketProvider>
          <Router>
            <AppRoutes />
          </Router>
        </SocketProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

