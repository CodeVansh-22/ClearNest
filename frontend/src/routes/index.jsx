import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LandingPage from '../pages/LandingPage';
import ResidentDashboard from '../pages/ResidentDashboard';
import CommitteeDashboard from '../pages/CommitteeDashboard';
import LedgerPage from '../pages/LedgerPage';
import ComplaintPage from '../pages/ComplaintPage';
import VotingPage from '../pages/VotingPage';
import VendorBiddingPage from '../pages/VendorBiddingPage';
import AuthPage from '../pages/AuthPage';
import SocietyOnboarding from '../pages/SocietyOnboarding';
import VerifyVisitor from '../pages/VerifyVisitor';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/register-society" element={<SocietyOnboarding />} />
      <Route path="/register%20society" element={<Navigate to="/register-society" replace />} />
      <Route path="/register society" element={<Navigate to="/register-society" replace />} />
      <Route path="/verify-visitor" element={<VerifyVisitor />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<ResidentDashboard />} />
          <Route path="/committee" element={<CommitteeDashboard />} />
          <Route path="/ledger" element={<LedgerPage />} />
          <Route path="/complaints" element={<ComplaintPage />} />
          <Route path="/voting" element={<VotingPage />} />
          <Route path="/vendors" element={<VendorBiddingPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
