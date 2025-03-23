import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Header } from './components/layout/Header';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RoleRoute } from './components/auth/RoleRoute';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { CredentialWallet } from './pages/CredentialWallet';
import { VerificationRequests } from './pages/VerificationRequests';
import { IssueCredentials } from './pages/IssueCredentials';
import { Profile } from './pages/Profile';
import { Staking } from './pages/Staking';
import { useAuthStore } from './store/useAuthStore';
import { logAppState } from './lib/debugUtils';

function App() {
  const { user } = useAuthStore();
  
  useEffect(() => {
    // Log app state for debugging
    logAppState();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/credentials" element={<CredentialWallet />} />
            <Route path="/verification-requests" element={<VerificationRequests />} />
            <Route path="/verify" element={<VerificationRequests />} />
            <Route path="/staking" element={<Staking />} />
            <Route path="/issue-credentials" element={<IssueCredentials />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;